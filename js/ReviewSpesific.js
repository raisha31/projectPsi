document.addEventListener('DOMContentLoaded', () => {
    const accessToken = getCookie('access_token');
    let selectedType = 'Keuangan'; // Default type

    const params = new URLSearchParams(window.location.search);
    const rekomendasi_ke = params.get('id');
    console.log(rekomendasi_ke)
    selectedType = params.get('tipe')

    if (accessToken) {
        fetchReviewData(selectedType,rekomendasi_ke);
    } else {
        console.error('No access token found in cookies');
    }

    const generateReviewBtn = document.getElementById('generateReviewBtn');
    const loadingBtn = document.getElementById('loadingBtn');

    generateReviewBtn.addEventListener('click', () => generateNewReview(selectedType));

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            selectedType = item.getAttribute('data-type');
            fetchReviewData(selectedType,rekomendasi_ke);
        });
    });
});

async function fetchReviewData(type,rekomendasi_ke) {
    console.log("Attempting to fetch data...");
    const accessToken = getCookie('access_token');
    console.log(type)




    if (!accessToken) {
        console.error('Access token is missing.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3002/rekomendasiAI/${rekomendasi_ke}?type=${type}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.msg === 'Query Successfully') {
            console.log('Data fetched successfully:', data.data);
            populateCards(data.data);
        } else {
            console.error('Failed to fetch data:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function generateNewReview(type) {
    const generateReviewBtn = document.getElementById('generateReviewBtn');
    const loadingBtn = document.getElementById('loadingBtn');

    console.log(type)

    try {
        showLoading(generateReviewBtn, loadingBtn);
        const response = await fetch(`http://localhost:3002/askAi?tipe=${type}`, { // Fixed the typo here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('access_token')
            }
        });
        if (!response.ok) {
            throw new Error('Failed to generate new review');
        }
        const responseData = await response.json();
        console.log(responseData);
        await fetchReviewData(type);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        hideLoading(generateReviewBtn, loadingBtn);
    }
}

function showLoading(generateReviewBtn, loadingBtn) {
    generateReviewBtn.style.display = 'none';
    loadingBtn.style.display = 'inline-block';
}

function hideLoading(generateReviewBtn, loadingBtn) {
    generateReviewBtn.style.display = 'inline-block';
    loadingBtn.style.display = 'none';
}

function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    return null;
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function populateCards(data) {
    const chartRow = document.getElementById('chartRow');
    chartRow.innerHTML = ''; // Clear existing content
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'col mb-4 px-5';
        card.innerHTML = `
            <div class="card" style="width: 100%; ">
                <div class="card-body">
                    <h5 class="card-title">${item.asal_daerah}</h5>
                    <p class="card-text">Kondisi: ${item.kondisi}%</p>
                    <p class="card-text">Alasan: ${item.alasan}</p>
                    <p class="card-text">Rekomendasi: ${item.rekomendasi_ai}</p>
                </div>
            </div>
        `;
        chartRow.appendChild(card);
    });
}
