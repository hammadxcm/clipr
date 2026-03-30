export function initSearch(): void {
  const input = document.getElementById('search-input') as HTMLInputElement | null;
  const table = document.getElementById('link-table');
  if (!input || !table) return;

  let debounceTimer: ReturnType<typeof setTimeout>;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');

      for (const row of rows) {
        const text = row.textContent?.toLowerCase() ?? '';
        (row as HTMLElement).style.display = text.includes(query) ? '' : 'none';
      }
    }, 300);
  });

  // Tag filter chips
  const chips = document.querySelectorAll('[data-tag-filter]');
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag-filter');
      if (!tag) return;
      chip.classList.toggle('active');
      const activeChips = document.querySelectorAll('[data-tag-filter].active');
      const activeTags = Array.from(activeChips).map((c) => c.getAttribute('data-tag-filter'));

      const rows = table.querySelectorAll('tbody tr');
      for (const row of rows) {
        if (activeTags.length === 0) {
          (row as HTMLElement).style.display = '';
          continue;
        }
        const rowTags = row.getAttribute('data-tags')?.split(',') ?? [];
        const match = activeTags.some((t) => t && rowTags.includes(t));
        (row as HTMLElement).style.display = match ? '' : 'none';
      }
    });
  }
}
