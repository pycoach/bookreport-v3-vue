<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <div class="preview-image-lg">
          <div class="d-flex justify-space-between align-center mb-5">
            <v-skeleton-loader
              v-if="isLoadingPreview"
              loading
              type="chip"
              class="mx-0"
            />
            <span v-else v-html="getPageStatus()" />
            <div>
              <v-btn
                text
                icon
                large
                color="dark"
                :disabled="isLoadingPreview || currentPageIndex === 1"
                @click="onPrevPage"
              >
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <v-btn
                text
                icon
                large
                color="dark"
                :disabled="isLoadingPreview || (pageMap.pages && pageMap.pages.length === currentPageIndex)"
                @click="onNextPage"
              >
                <v-icon>arrow_forward</v-icon>
              </v-btn>
            </div>
          </div>
          <v-skeleton-loader
            v-if="isLoadingPreview"
            loading
            type="image"
            class="mx-auto"
          />
          <div class="canvas-wrapper">
            <div id="imageCanvas" ref="imageWrapperRef" />
            <canvas v-show="!isLoadingPreview" id="image-display" ref="imageDisplayRef" />
            <canvas id="image-temp" style="display: none" />
          </div>
        </div>
      </v-col>
      <v-col cols="3">
        <div class="snippets-wrapper">
          <template v-if="isLoadingPreview || isLoadingSnippets">
            <v-skeleton-loader
              v-for="(_, index) in 7"
              :key="index"
              loading
              type="image"
              class="mx-auto snippet-skeleton"
            />
          </template>
          <SnippetsList
            v-else
            :snippets="allSnippets"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { EventBus } from '../components/categoriesComponents/Document/Preview/eventBus' 
import Konva from 'konva'
import SnippetsList from '../components/categoriesComponents/Document/Preview/SnippetsList';
export default {
  name: 'fileViewer',
  components: {
    SnippetsList
  },
  props: ['id', 'pageIndex'],
  computed: {
    ...mapState('FilePreview', ['pageMap', 'image', 'pageStatuses', 'isLoadingPreview', 'isLoadingDocumentEvent']),
    ...mapGetters('DocumentSnippets', ['getSnippets']),
    ...mapState('DocumentSnippets', ['isLoadingSnippets']),
  },
  created () {
    this.currentPageIndex = parseInt(this.pageIndex);
    window.addEventListener('keydown', this.addKeyDown)
  },
  data() {
    return {
      currentPageIndex: 1,
      max: 1,
      pages: {},
      sprites: {},
      selecting: false,
      selectedSnippetId: '',
      creatingSnippet: false,
      newSnippet: {},
      layer: {},
      stage:{},
      snippets: {},
      allSnippets: [],
      canvasRatio: 1,
      spritesLoaded: false,
      snippetsLoaded: false,
      snippetData: [],
      pageProcessed: false,
      processedEvents: [],
      imageElement: ''
    }
  },
  methods: {
    requestPageMap() {
      const payload = {
        id: this.id,
        size: 'preview',
        fileName: 'page_map.json'
      };
      return this.$store.dispatch('FilePreview/loadPageMap', payload)
    },
    requestImage () {
      const payload = {
        id: this.id,
        size: 'preview',
        fileName: 'sprite0.png'
      };
      return this.$store.dispatch('FilePreview/loadImage', payload);
    },
    renderCurrentPage () {
      const canvas = this.$refs.imageDisplayRef;
      const ctx = canvas.getContext('2d');
      const imageElement = new Image();
      imageElement.onload = () => {
        let canvasWidth = this.pageMap.pages[this.currentPageIndex - 1][2];
        let canvasHeight = this.pageMap.pages[this.currentPageIndex - 1][3];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx.drawImage(imageElement, 0, -this.pageMap.pages[this.currentPageIndex - 1][1]);
        this.createStage(canvas);
        this.createLayer();
        this.stage.add(this.layer)
        this.imageElement = imageElement
      };
      imageElement.src = this.image;
    },
    requestDocumentType (pageIndex, eventType = 1) {
      if (!pageIndex) return;
      const payload = {
        file_id: this.id,
        page_index: pageIndex,
        event_type: eventType
      };
      return this.$store.dispatch('FilePreview/loadDocumentEvent', payload)
    },
    requestSnippets () {
      return this.$store.dispatch('DocumentSnippets/loadSnippets', this.id).then((snippetData) => {
        this.snippetData = snippetData
        this.addSnippetsToPage()
      })
    },
    onNextPage () {
      if (this.pageMap.pages.length === this.currentPageIndex) return;
      this.currentPageIndex++
    },
    onPrevPage () {
      if (this.currentPageIndex === 1) return
      this.currentPageIndex--
    },
    getPageStatus () {
      let status;
      switch(this.pageStatuses[this.currentPageIndex]) {
        case 0:
          status = '<div class="status status-unread"><i class="material-icons">insert_drive_file</i> Unread</div>';
          break;
        case 1:
          status = '<div class="status status-read"><i class="material-icons">insert_drive_file</i> Read</div>';
          break;
        case 3:
          status = '<div class="status status-processed"><i class="material-icons">insert_drive_file</i> Processed</div>';
          break;
      }
      return status
    },
    addKeyDown (event) {
      switch(event.code) {
        case 'ArrowLeft':
          this.onPrevPage();
          break;
        case 'ArrowRight':
          this.onNextPage();
          break;
      }
    },
    makeSnippet: function (x, y, width, height, name) {
      const that = this;
      let options = {'x': x, 'y': y, 'width': width, 'height': height, 'name': name};
      options.stroke = 'orange';
      options.strokeWidth = 2;
      options.draggable = true;
      let rect = new Konva.Rect(options);
    
      rect.on('mousedown', function() {
        that.selecting = true
        that.selectedSnippetId = this.name()
      });
    
      rect.on('mouseup', function () {
        that.saveSnippet(this)
      });
    
      rect.on('click', function() {
        that.renderCurrentPage()
      });
    
      rect.on('dragend', function() {
        that.renderCurrentPage()
      });
    
      return rect
    },
    createStage: function (canvas) {
      const that = this;
      const canvasWrapper = document.getElementById('imageCanvas');
      let stage = new Konva.Stage({container: 'imageCanvas', width: canvasWrapper.clientWidth, height: canvas.height});
      stage.on('contentMousedown', function() {
        if (!that.selecting) {
          that.creatingSnippet = true;
          that.selectedSnippetId = '';
          let pointer = stage.getPointerPosition();
          let snippetId = String(Math.random(0, 999999)).replace(/-/g,'');
          that.newSnippet = that.makeSnippet(pointer.x, pointer.y, 0, 0, snippetId);
          that.layer.add(that.newSnippet)
        }
      });
      stage.on('contentMousemove', function() {
        if (that.creatingSnippet) {
          let x = that.newSnippet.getX();
          let y = that.newSnippet.getY();
          let width = stage.getPointerPosition().x - x;
          let height = stage.getPointerPosition().y - y;
          that.newSnippet.width(width)
          that.newSnippet.height(height)
          that.newSnippet.parent.draw()
        }
      });
      stage.on('contentMouseup', function() {
        if (that.creatingSnippet) {
          let snippetData = that.saveSnippet(that.newSnippet)
          if (snippetData.Width > 5 && snippetData.Height > 5) {
            that.selectedSnippetId = snippetData.entity_id
          } else {
            that.selectedSnippetId = ''
            that.renderCurrentPage()
          }
          that.creatingSnippet = false
          that.newSnippet = {}
        }
        that.selecting = false
      });
      this.stage = stage
    },
    saveSnippetData: function (snippetData) {
      console.log('////////////////*/*/*/*/**//* snippetData', snippetData)
      console.log('////////////////*/*/*/*/**//* snippetList', this.snippets[this.currentPageIndex])
      let snippetList = this.snippets[this.currentPageIndex];
      if (snippetData.Width > 5 && snippetData.Height > 5) {
        for (let i = 0; i < snippetList.length; i++) {
          if (snippetList[i].entity_id === snippetData.entity_id) {
            snippetList[i] = snippetData
            console.log("JS - snippet updated", snippetData);
            this.$store.dispatch('DocumentSnippets/updateSnippet', snippetData)
            // organizationFileService.updateSnippet(snippetData).then()
            break
          }
        }
        for (let i = 0; i < this.allSnippets.length; i++) {
          if (this.allSnippets[i].entity_id === snippetData.entity_id) {
            this.allSnippets.splice(i,1);
            this.allSnippets.push(snippetData);
            return snippetData
          }
        }
        // snippetList.push(snippetData);
        this.allSnippets.push(snippetData);
        this.$store.dispatch('DocumentSnippets/addNewSnippet', snippetData)
        this.requestDocumentType(this.currentPageIndex);
        return snippetData
      }
    },
    saveSnippet (snippet) {
      if (!this.snippets.hasOwnProperty(this.currentPageIndex)) {
        this.snippets[this.currentPageIndex] = []
      }
      let x = snippet.getX()
      let y = snippet.getY()
      let width = snippet.width()
      let height = snippet.height()
      let entityId = snippet.name()

      let imageData = ''

      if (width > 0 && height > 0) {
        imageData = this.getSnippetImage(x, y, width, height)
      }

      let snippetData = {"entity_id": entityId, "DocumentID": this.id, "page_index": this.currentPageIndex,
        "X": x, "Y": y, "Width": width, "Height": height, "ImageData": imageData}

      this.saveSnippetData(snippetData)

      return snippetData
    },
    createLayer: function () {
      const that = this;
      that.layer = new Konva.Layer()
    
      if (that.snippets.hasOwnProperty(that.currentPageIndex)) {
        let snippetList = that.snippets[that.currentPageIndex]
        console.log("Existing snippets found")
        console.log(snippetList)

        for (let i = 0; i < snippetList.length; i++) {
          let snippet = snippetList[i];
          let rect = {};
          if (that.selectedSnippetId === snippet.entity_id) {
            rect = that.makeResizableSnippet(
              snippet.x,
              snippet.y,
              snippet.width,
              snippet.height,
              snippet.entity_id
            )
          } else {
            rect = that.makeSnippet(
              snippet.x,
              snippet.y,
              snippet.width,
              snippet.height,
              snippet.entity_id
            )
          }
          that.layer.add(rect)
        }
      }

      that.stage.add(that.layer)
    },
    getSnippetImage (x, y, width, height) {
      const image_canvas = document.getElementById('image-display')
      const image_context = image_canvas.getContext('2d')
      return image_context.getImageData(x, y, width, height)
    },
    makeResizableSnippet: function (x, y, width, height, name) {
      const that = this
    
      let options = {"width": width, "height": height}
      options.stroke = 'orange'
      options.strokeWidth = 2
    
      let rect = new Konva.Rect(options)
    
      function update(activeAnchor, that) {
        let group = activeAnchor.getParent();
      
        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];
      
        let anchorX = activeAnchor.getX();
        let anchorY = activeAnchor.getY();
      
        // update anchor positions
        switch (activeAnchor.getName()) {
          case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
          case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
          case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
          case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
        }
      
        rect.position(topLeft.position());
      
        let width = topRight.getX() - topLeft.getX();
        let height = bottomLeft.getY() - topLeft.getY();
        if(width && height) {
          rect.width(width);
          rect.height(height);
        }
      }
      function addAnchor(group, x, y, name, that) {
        let stage = that.stage
        let layer = that.layer
      
        let anchor = new Konva.Circle({
          x: x,
          y: y,
          stroke: '#666',
          fill: '#ddd',
          strokeWidth: 2,
          radius: 8,
          name: name,
          draggable: true,
          dragOnTop: false
        });
      
        anchor.on('mousedown', function () {
          that.selecting = true
        })
        anchor.on('dragmove', function() {
          update(this, that);
          layer.draw();
        });
        anchor.on('mousedown touchstart', function() {
          group.setDraggable(false);
          this.moveToTop();
        });
        anchor.on('dragend', function() {
          group.setDraggable(true);
          update(this, that);
          layer.draw();
        });
        // add hover styling
        anchor.on('mouseover', function() {
          let layer = this.getLayer();
          document.body.style.cursor = 'pointer';
          this.setStrokeWidth(4);
          layer.draw();
        });
        anchor.on('mouseout', function() {
          let layer = this.getLayer();
          document.body.style.cursor = 'default';
          this.setStrokeWidth(2);
          layer.draw();
        });
      
        group.add(anchor);
      }
    
      let snippetGroup = new Konva.Group({
        x: x,
        y: y,
        name: name,
        draggable: true
      })
    
      snippetGroup.on('dragend', function () {
        let topLeft = this.get('.topLeft')[0]
      
        let x = (this.getX() + topLeft.getX())
        let y = (this.getY() + topLeft.getY())
        let adjustedWidth = rect.width()
        let adjustedHeight = rect.height()
        let name = this.name()
      
        let imageData = ''
      
        if (width > 0 && height > 0) {
          imageData = that.getSnippetImage(x, y, adjustedWidth, adjustedHeight)
        }
      
        let snippetData = {"entity_id": name, "DocumentID": that.id, "page_index": that.currentPageIndex,
          "X": x, "Y": y, "Width": adjustedWidth, "Height": adjustedHeight, "ImageData": imageData}
      
        that.saveSnippetData(snippetData)
        that.renderCurrentPage()
      })
    
      let top = 0
      let bottom = height
      let left = 0
      let right = width
    
      snippetGroup.add(rect)
      addAnchor(snippetGroup, left, top, 'topLeft', that)
      addAnchor(snippetGroup, right, top, 'topRight', that)
      addAnchor(snippetGroup, right, bottom,'bottomRight', that)
      addAnchor(snippetGroup, left, bottom, 'bottomLeft', that)
    
      return snippetGroup
    },
    addSnippetsToPage: function () {
      console.log("Adding snippets to page");
      console.log("Snippets", this.snippets);
      console.log("SnippetData", this.snippetData);
      if (!this.snippetData.length) return
      // this.allSnippets = [];
      // this.snippets = [];
      for (let i = 0; i < this.snippetData.length; i++) {
        let snippet = this.snippetData[i]
        let pageIndex = snippet["page_index"]
        if (!this.snippets.hasOwnProperty(pageIndex)) {
          this.snippets[pageIndex] = []
        }
        let x = snippet.x
        let y = snippet.y
        let width = snippet.width
        let height = snippet.height
        let entityId = snippet.entity_id
        let imageData = ''
        if (width > 0 && height > 0) {
          imageData = this.getSnippetImageData(pageIndex, x, y, width, height)
        }
        let snippetData = {'entity_id': entityId, 'document_id': snippet['document_id'], 'page_index': pageIndex,
          'x': x, 'y': y, 'width': width, 'height': height, 'ImageData': imageData}
        this.snippets[pageIndex].push(snippetData)
        this.allSnippets.push(snippetData)
      }
      this.renderCurrentPage()
    },
    getSnippetImageData: function(pageIndex, x, y, width, height) {
      const canvas = document.getElementById('image-temp')
      const context = canvas.getContext('2d')
      let page_data = this.pageMap.pages[pageIndex - 1]
      // let spriteIndex = page_data[0];
      // console.log('spriteIndex', spriteIndex);
      // console.log('this.sprites', this.sprites);
      let sprite_image = this.imageElement
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = page_data[2];
      canvas.height = page_data[3];
      context.drawImage(sprite_image, 0, page_data[1], page_data[2], page_data[3], 0, 0, canvas.width, canvas.height);
      return context.getImageData(x, y, width, height)
    },
    deleteSnippet (entity_id) {
      // this.$store.dispatch('DocumentSnippets/deleteSnippet', entity_id);
      let snippetList = this.snippets[this.currentPageIndex];
      console.log('snippetList', snippetList)
      for (let i = 0; i < snippetList.length; i++){
        let snippet = snippetList[i]
        if (snippet.entity_id === entity_id) {
          snippetList.splice(i, 1)
          this.selectedSnippetId = ''
          break
        }
      }
      for (let i=0;i < this.allSnippets.length;i++){
        let snippet = this.allSnippets[i]
        if (snippet.entity_id === entity_id) {
          this.allSnippets.splice(i, 1)
          return
        }
      }
    }
  },
  async mounted () {
    EventBus.$on('handleSnippetPage', (pageIndex) => {
      this.currentPageIndex = pageIndex
    });
    EventBus.$on('handleSnippetDelete', (entity_id) => {
      this.deleteSnippet(entity_id)
    });
    await this.requestPageMap();
    await this.requestImage();
    await this.requestSnippets()
    await this.$store.dispatch('FilePreview/loadPageStatus', this.id);
    this.renderCurrentPage()
  },
  watch: {
    image (newImage) {
      if (!newImage || this.isLoadingPreview) return;
      this.renderCurrentPage()
    },
    currentPageIndex () {
      // this.allSnippets = [];
      // this.snippets = [];
      this.requestDocumentType(this.currentPageIndex);
      // this.requestSnippets();
      this.renderCurrentPage();
      // this.addSnippetsToPage()
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.addKeyDown)
  }
}
</script>

<style lang="scss">
  .preview-image-lg {
    position: relative;
    overflow: hidden;
    min-height: 862px;
    .v-skeleton-loader__image {
      min-height: 862px !important;
    }
    .status {
      position: relative;
      display: inline-flex;
      font-size: 13px;
      align-items: center;
      font-weight: 600;
      padding: 5px 12.5px;
      i {
        font-size: 25px;
        margin-right: 5px;
      }
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: currentColor;
        border-radius: 50px;
        opacity: 0.2;
      }
      &-processed {
        color: green;
      }
      &-read {
        color: orange;
      }
    }
  }
  #imageCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .canvas-wrapper {
    position: relative;
    canvas {
      /*width: 100%;*/
    }
  }
  .snippets-wrapper {
    max-height: 1160px;
    overflow: auto;
    .snippet-skeleton {
      margin-bottom: 23px;
      &:last-child {
        margin-bottom: 0;
      }
      .v-skeleton-loader__image {
        height: 146px;
      }
    }
  }
</style>