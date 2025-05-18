export function getPageRange(currentPage: number, available: number): number[] {
    if (currentPage < 0 || available <= 0) {
        return [1];
    }

    const maxPagesToShow = 5;
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, available);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    const pageRange = [];
    for (let i = startPage; i <= endPage; i++) {
        pageRange.push(i);
    }

    return pageRange;
}