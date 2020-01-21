<template>
    <form class="dropzone">
        <!-- Not displayed, just for Dropzone's `dictDefaultMessage` option -->
        <div id="dropzone-message" style="display: none">
            <span class="dropzone-title">Drop files here or click to select</span>
            <span class="dropzone-info">You can upload multiple files at once</span>
        </div>
    </form>
</template>

<script>
import Dropzone from 'dropzone';
import '../../../../node_modules/dropzone/dist/dropzone.css';
Dropzone.autoDiscover = false;
export default {
  name: 'VueDropzone',
  mounted() {
    const vm = this
    const options = {
      url: '/',
      method: 'put',
      sending(file, xhr) {
        const _send = xhr.send
        xhr.send = () => {
          _send.call(xhr, file)
        }
      },
      parallelUploads: 8,
      uploadMultiple: false,
      header: '',
      maxFilesize: 10000,
      // Customize the wording
      dictDefaultMessage: document.querySelector('#dropzone-message').innerHTML,
      autoProcessQueue: false,
    };

    // Instantiate Dropzone
    this.dropzone = new Dropzone(this.$el, options)

    // Set signed upload URL for each file
    vm.dropzone.on('processing', file => {
      vm.dropzone.options.url = file.uploadURL
    });

    vm.dropzone.on('complete', file => {
      vm.dropzone.processQueue()
    });

    vm.dropzone.on('queuecomplete', () => {
      vm.$emit('queuecomplete')
    });
  }
}
</script>

<style scoped>

</style>