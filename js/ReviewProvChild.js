document.addEventListener('DOMContentLoaded', () => {
    const accessToken = getCookie('access_token');
    let selectedType = 'Keuangan'; // Default type

    if (accessToken) {
        fetchReviewData(selectedType);
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
            fetchReviewData(selectedType);
        });
    });
});

async function fetchReviewData(type) {
    console.log("Attempting to fetch data...");
    const accessToken = getCookie('access_token');
    console.log(type)

    if (!accessToken) {
        console.error('Access token is missing.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3002/rekomendasiAI?type=${type}`, {
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
            populateCards(data.data,type);
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

function populateCards(data,type) {
    const chartRow = document.getElementById('chartRow');
    chartRow.innerHTML = ''; // Clear existing content
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-3 mb-4';
        card.innerHTML = `
           <a href="ReviewProvSpesific.html?id=${item.rekomendasi_ke}&&tipe=${type}" style="text-decoration: none; color: inherit; display: block;">
                <div class="card" style="width: 18rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
                    onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)';" 
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
                    <div class="card-body">
                        <h5 class="card-title">${item.asal_daerah}</h5>
                        <p class="card-text">Kondisi: ${item.kondisi}%</p>
                        <p class="card-text">Alasan: ${truncateText(item.alasan, 50)}</p>
                        <p class="card-text">Rekomendasi: ${truncateText(item.rekomendasi_ai, 50)}</p>
                    </div>
                </div>
            </a>

        `;
        chartRow.appendChild(card);
    });
}
