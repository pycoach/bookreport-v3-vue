<template>
  <v-container>
    <v-row>
      <v-col cols="7">
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
          <div id="imageCanvas" />
          <canvas v-show="!isLoadingPreview" id="imageDisplay" ref="imageDisplayRef" />
        </div>
      </v-col>
      <v-col cols="5">
        <v-skeleton-loader
          v-if="isLoadingPreview"
          loading
          type="image"
          class="mx-auto"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import Konva from 'konva'
export default {
  name: 'fileViewer',
  props: ['id', 'pageIndex'],
  computed: {
    ...mapState('FilePreview', ['pageMap', 'image', 'pageStatuses', 'isLoadingPreview', 'isLoadingDocumentEvent']),
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
      processedEvents: []
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
      this.$store.dispatch('FilePreview/loadImage', payload);
    },
    renderCurrentPage () {
      const canvas = this.$refs.imageDisplayRef;
      const ctx = canvas.getContext("2d");
      const imageElement = new Image();
      imageElement.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = this.pageMap.pages[this.currentPageIndex - 1][2];
        canvas.height = this.pageMap.pages[this.currentPageIndex - 1][3];
        ctx.drawImage(imageElement, 0, -this.pageMap.pages[this.currentPageIndex - 1][1]);
      };
      imageElement.src = this.image;
      this.createStage(canvas);
      this.createLayer();
      this.stage.add(this.layer)
    },
    requestDocumentType (pageIndex, eventType = 1) {
      const payload = {
        file_id: this.id,
        page_index: pageIndex,
        event_type: eventType
      };
      return this.$store.dispatch('FilePreview/loadDocumentEvent', payload)
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
      let stage = new Konva.Stage({container: 'imageCanvas', width:(canvas.width * this.canvasRatio) + 20, height: canvas.height * this.canvasRatio});
      stage.on('contentMousedown', function() {
        if (!that.selecting) {
          that.creatingSnippet = true;
          that.selectedSnippetId = '';
          let pointer = stage.getPointerPosition();
          let snippetId = String(Math.random(0, 999999)).replace(/-/g,'');
          let rect = that.makeSnippet(pointer.x, pointer.y, 0, 0, snippetId);
          that.newSnippet = rect;
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
            that.selectedSnippetId = snippetData.EntityID
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
      let snippetList = this.snippets[this.pageIndex]
    
      if (snippetData.Width > 5 && snippetData.Height > 5) {
        for (let i=0;i < snippetList.length;i++) {
          if (snippetList[i].EntityID === snippetData.EntityID) {
            snippetList[i] = snippetData
            console.log("Snippet " + snippetData.EntityID + " updated")
            // organizationFileService.updateSnippet(snippetData).then()
            break
          }
        }
        for (let i=0;i < this.allSnippets.length;i++) {
          if (this.allSnippets[i].EntityID === snippetData.EntityID) {
            this.allSnippets.splice(i,1)
            this.allSnippets.push(snippetData)
            return snippetData
          }
        }
        snippetList.push(snippetData)
        this.allSnippets.push(snippetData)
        // organizationFileService.createSnippet(snippetData).then()
        // this.addPageEvent(2)
        console.log("New snippet created")
        console.log(snippetData)

        return snippetData
      }
    },
    // saveSnippet (snippet) {
    //   if (!this.snippets.hasOwnProperty(this.pageIndex)) {
    //     this.snippets[this.pageIndex] = []
    //   }
    //   let snippetList = this.snippets[this.pageIndex]
    //   let x = snippet.getX() / this.canvasRatio
    //   let y = snippet.getY() / this.canvasRatio
    //   let width = snippet.width() / this.canvasRatio
    //   let height = snippet.height() / this.canvasRatio
    //   let entityId = snippet.name()
    //
    //   let imageData = ''
    //
    //   if (width > 0 && height > 0) {
    //     imageData = this.getSnippetImage(x, y, width, height)
    //   }
    //
    //   let snippetData = {"EntityID": entityId, "DocumentID": this.id, "PageIndex": this.pageIndex,
    //     "X": x, "Y": y, "Width": width, "Height": height, "ImageData": imageData}
    //
    //   this.saveSnippetData(snippetData)
    //
    //   return snippetData
    // },
    createLayer: function () {
      const that = this;
      that.layer = new Konva.Layer()
    
      // if (that.snippets.hasOwnProperty(that.pageIndex)) {
      //   let snippetList = that.snippets[that.pageIndex]
      //   console.log("Existing snippets found")
      //   console.log(snippetList)
      //
      //   for (let i = 0; i < snippetList.length; i++) {
      //     let snippet = snippetList[i]
      //  
      //     let rect = {}
      //  
      //     if (that.selectedSnippetId === snippet.EntityID) {
      //       rect = that.makeResizableSnippet(snippet.X * that.canvasRatio,
      //         snippet.Y * that.canvasRatio,
      //         snippet.Width * that.canvasRatio,
      //         snippet.Height * that.canvasRatio,
      //         snippet.EntityID)
      //     }
      //     else {
      //       rect = that.makeSnippet(snippet.X * that.canvasRatio,
      //         snippet.Y * that.canvasRatio,
      //         snippet.Width * that.canvasRatio,
      //         snippet.Height * that.canvasRatio,
      //         snippet.EntityID)
      //     }
      //     that.layer.add(rect)
      //   }
      // }
      //
      that.stage.add(that.layer)
    }
  },
  async mounted () {
    await this.requestPageMap();
    await this.requestImage();
    await this.$store.dispatch('FilePreview/loadPageStatus', this.id);
    this.renderCurrentPage()
  },
  watch: {
    image (newImage) {
      if (!newImage || this.isLoadingPreview) return;
      this.renderCurrentPage()
    },
    currentPageIndex () {
      this.requestDocumentType(this.currentPageIndex);
      this.renderCurrentPage(this.currentPageIndex)
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
  }
</style>