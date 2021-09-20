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


var categoryArr = [
    {
        id: "webApiCss",
        "name": "Web API && CSS",
        "path": [""],
        distFileName: 'webApiCss'
    },
    {
        "id": "libLearn",
        "name": "工具类库学习",
        "path": [""],
        distFileName: 'libLearn',
    },
    {
        id: 'sourceCodeLearn',
        name: '工具类库源码',
        path: [""],
        distFileName: 'sourceCodeLearn',
    },
    {
        id: 'softwareProject',
        name: '软件工程相关',
        path: [""],
        distFileName: 'softwareProject',
    },
    {
        id: 'practiceSummary',
        name: '实践类总结',
        path: [""],
        distFileName: 'practiceSummary',
    },
    {
        id: 'others',
        name: "其它",
        path: ["*"],
        distFileName: 'others',
    }
]