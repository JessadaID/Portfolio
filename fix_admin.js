const fs = require('fs');
const file = 'src/routes/admin/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// Remove emojis
content = content.replace(/💡 สิ่งที่ได้เรียนรู้/g, 'สิ่งที่ได้เรียนรู้');
content = content.replace(/📝 Detail Content/g, 'Detail Content');
content = content.replace(/✏️ Editor/g, 'Editor');
content = content.replace(/👁 Live Preview/g, 'Live Preview');
content = content.replace(/🖼 แทรกรูปภาพเข้าใน Markdown/g, 'แทรกรูปภาพเข้าใน Markdown');
content = content.replace(/➕ แทรกรูป/g, 'แทรกรูป');
content = content.replace(/⚡ คลิกใน editor/g, 'คลิกใน editor');

// Enhance layout
content = content.replace('class="container mx-auto p-4 md:p-8 max-w-2xl"', 'class="container mx-auto p-4 md:p-8 max-w-4xl"');
content = content.replace('<div class="bg-white p-6 rounded-lg shadow-md mb-8">', '<div class="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-8">');
content = content.replace(/<div class="bg-white p-6 rounded-lg shadow-md mb-8">/g, '<div class="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-8">');

// Add CSS classes for inputs and buttons at the end of the <style> block
const extraStyles = `
    .input-field {
        @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border transition-colors duration-200 outline-none;
    }
    .btn-primary {
        @apply inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .btn-secondary {
        @apply inline-flex justify-center items-center rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .btn-edit {
        @apply text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-200;
    }
    .btn-delete {
        @apply text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200;
    }
    
    /* Make checkboxes look better */
    input[type="checkbox"] {
        @apply h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500;
    }
`;

content = content.replace('</style>', extraStyles + '\n</style>');

fs.writeFileSync(file, content);
console.log('Admin page updated successfully!');
