// Auto-populate latest release info and direct .exe download
(async function () {
  const owner = 'user1763013';
  const repo = 'CopperBrowser';
  const api = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

  const downloadBtn = document.getElementById('download-btn');
  const assetLabel = document.getElementById('asset-label');
  const notesDiv = document.getElementById('notes');

  try {
    const res = await fetch(api, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const release = await res.json();

    // Populate release notes (markdown simplified)
    const title = release.name || release.tag_name || 'Latest release';
    const body = release.body || 'No release notes provided.';
    notesDiv.innerHTML = `
      <h4>${title}</h4>
      <pre>${escapeHtml(body)}</pre>
      <p class="small">Tag: ${release.tag_name}</p>
    `;

    // Find a .exe asset; fallback to releases/latest if none
    const exe = (release.assets || []).find(a => a.name.toLowerCase().endsWith('.exe'));
    if (exe) {
      downloadBtn.href = exe.browser_download_url;
      downloadBtn.textContent = `⬇ Download ${exe.name}`;
      assetLabel.textContent = `Published on ${new Date(release.published_at).toLocaleDateString()}`;
    } else {
      assetLabel.textContent = 'Executable not found — opening Releases page.';
    }
  } catch (err) {
    // Graceful fallback
    assetLabel.textContent = 'Unable to fetch release details — using fallback link.';
    notesDiv.innerHTML = `
      <p>Could not load release notes. You can still download from
      <a href="https://github.com/${owner}/${repo}/releases/latest" target="_blank" rel="noopener">Releases (latest)</a>.</p>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
})();