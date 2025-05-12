async function loadImages() {
    const name = document.getElementById('filterName').value;
    const date = document.getElementById('filterDate').value;
    const type = document.getElementById('filterType').value;

    const res = await fetch(\`/images?name=\${name}&date=\${date}&type=\${type}\`);
    const images = await res.json();
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    images.forEach(filename => {
        const img = document.createElement('img');
        img.src = '/uploads/' + filename;
        img.alt = filename;
        img.title = 'Cliquez pour télécharger';
        img.onclick = () => window.open('/uploads/' + filename);
        gallery.appendChild(img);
    });
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('imageInput');
    const formData = new FormData();
    formData.append('image', input.files[0]);

    await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    input.value = '';
    loadImages();
});

loadImages();