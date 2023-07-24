// db.js

// 가상의 드래곤 정보 데이터 (테스트용)
let dragonsData = [];

// 데이터를 불러오는 함수 (CORS 우회용)
async function fetchData() {
    try {
        const response = await fetch('dragonsData.json');
        dragonsData = await response.json();
        console.log('드래곤 데이터를 불러왔습니다.');
        // 데이터를 불러온 후에는 웹사이트의 나머지 부분을 구성하거나 다른 기능을 수행할 수 있습니다.
        // 예를 들어 displayDragons() 함수를 호출하여 드래곤 정보를 화면에 표시할 수 있습니다.
        filterDragons();
    } catch (error) {
        console.error('드래곤 데이터를 불러오는데 문제가 발생했습니다:', error);
    }
}

// 드래곤 정보를 표시하는 함수
function displayDragons(dragons, searchKeywords = []) {
    const dragonsTableBody = document.querySelector("#dragons-table tbody");
    dragonsTableBody.innerHTML = ''; // 기존의 행들을 모두 비우기

    // 각 드래곤 정보를 순회하면서 테이블 행으로 추가
    for (const dragon of dragons) {
        const dragonRow = createDragonRow(dragon, searchKeywords);
        dragonsTableBody.appendChild(dragonRow);
    }
}

// 드래곤 정보를 표시하는 HTML 테이블 행을 생성하는 함수
function createDragonRow(dragon, searchKeywords) {
    const dragonRow = document.createElement("tr");

    // 사진
    const dragonImageCell = document.createElement("td");
    const dragonImage = document.createElement("img");
    dragonImage.src = dragon.image;
    dragonImage.alt = dragon.name;
    dragonImage.width = 100; // 원하는 너비 값으로 지정
    dragonImage.height = 100; // 원하는 높이 값으로 지정
    dragonImageCell.appendChild(dragonImage);
    dragonRow.appendChild(dragonImageCell);

    // 이름
    const dragonNameCell = document.createElement("td");
    dragonNameCell.textContent = dragon.name;
    dragonRow.appendChild(dragonNameCell);

    // 속성
    const dragonAttributeCell = document.createElement("td");
    dragonAttributeCell.textContent = dragon.attribute;
    dragonRow.appendChild(dragonAttributeCell);

    // 획득처
    const dragonAcquisitionCell = document.createElement("td");
    dragonAcquisitionCell.textContent = dragon.acquisition;
    dragonRow.appendChild(dragonAcquisitionCell);

    // 문구
    const dragonDescriptionCell = document.createElement("td");
    dragonDescriptionCell.textContent = dragon.description;
    dragonRow.appendChild(dragonDescriptionCell);

    // 특수 능력
    const dragonAbilityCell = document.createElement("td");
    dragonAbilityCell.textContent = dragon.specialAbility;
    dragonRow.appendChild(dragonAbilityCell);

    // 검색어 하이라이트 적용
    for (const keyword of searchKeywords) {
        highlightKeywords(dragonNameCell, keyword);
        highlightKeywords(dragonAttributeCell, keyword);
        highlightKeywords(dragonAcquisitionCell, keyword);
        highlightKeywords(dragonDescriptionCell, keyword);
        highlightKeywords(dragonAbilityCell, keyword);
    }

    return dragonRow;
}

// 검색 기능 추가
function filterDragons() {
    const searchText = document.querySelector("#search").value.toLowerCase();
    const searchKeywords = searchText.split(',').map(keyword => keyword.trim());

    const selectedAttribute = document.querySelector("#attribute-filter").value;
    const selectedAcquisition = document.querySelector("#acquisition-filter").value;

    let filteredDragons = dragonsData;

    // 검색어를 포함하는 드래곤 필터링
    if (searchText !== '') {
        filteredDragons = filteredDragons.filter(dragon => {
            return searchKeywords.some(keyword =>
                dragon.name.toLowerCase().indexOf(keyword) !== -1 ||
                dragon.attribute.toLowerCase().indexOf(keyword) !== -1 ||
                dragon.acquisition.toLowerCase().indexOf(keyword) !== -1 ||
                dragon.description.toLowerCase().indexOf(keyword) !== -1 ||
                dragon.specialAbility.toLowerCase().indexOf(keyword) !== -1
            );
        });
    }

    // 속성 필터링
    if (selectedAttribute !== 'all') {
        filteredDragons = filteredDragons.filter(dragon => dragon.attribute.includes(selectedAttribute));
    }

    // 획득처 필터링
    if (selectedAcquisition !== 'all') {
        filteredDragons = filteredDragons.filter(dragon => dragon.acquisition === selectedAcquisition);
    }

    displayDragons(filteredDragons, searchKeywords);
}

// 검색어 하이라이트를 적용하는 함수
function highlightKeywords(cell, keyword) {
    const cellText = cell.textContent;
    const regex = new RegExp(keyword, 'gi');
    const highlightedText = cellText.replace(regex, match => `<span class="highlight">${match}</span>`);
    cell.innerHTML = highlightedText;
}

// 페이지 로딩 시 데이터를 불러오도록 호출
fetchData();
