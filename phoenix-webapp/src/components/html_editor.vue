<template>
  <editor-content :editor="editor"
    class="h-96 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
</template>

<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onBeforeUnmount, watch, type PropType } from 'vue';
import Image from '@tiptap/extension-image'

// props
const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true,
  },
});

// events
const $emit = defineEmits(['update:modelValue']);

// composables

// lifecycle
onBeforeUnmount(() => {
  editor.value!.destroy();
})

// variables
const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
  ],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert prose-sm p-2 focus:outline-none w-full h-full max-w-none',
    },
  },
  onUpdate: () => {
    // HTML
    $emit('update:modelValue', editor.value!.getHTML())
  },
});

// computed

// watch
watch(() => props.modelValue, (to) => {
  const isSame = editor.value!.getHTML() === to;
  if (isSame) {
    return;
  }
  editor.value!.commands.setContent(to, false);
});

// functions
</script>

