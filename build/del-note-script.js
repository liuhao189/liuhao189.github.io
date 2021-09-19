function getReadCatalogDomEl(headerList) {
    if (!headerList || !headerList.length) {
        return null;
    }
    //
    let listTemplate;
    headerList.forEach(headerItem => {
        let currItemHtmlStr = `<li> <a href="#/${headerItem.partId}">${headerItem.title}</a></li>`;
        listTemplate += currItemHtmlStr;
    });

    let divEl = document.createElement('div');
    divEl.innerHTML = `<ul>${listTemplate}</ul>`;
    divEl.classList.add(`read-catalog`)

    return divEl;
}

function generateReadCatalog() {
    let h2Headers = document.querySelectorAll('body>h2');
    let uid = 1;
    let h2HeaderArr = Array.prototype.slice.call(h2Headers);
    let headListForRender = [];
    h2HeaderArr.forEach(headerEl => {
        headerEl.id = `h2-title-${uid++}`;
        headListForRender.push({
            partId: headerEl.id,
            title: headerEl.innerText
        });
    })

    let el = getReadCatalogDomEl(headListForRender);
    if (!el) {
        return;
    }
    document.body.prepend(el);
}

// window.addEventListener('load', () => {
//     generateReadCatalog();
// });