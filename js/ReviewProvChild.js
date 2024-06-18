document.addEventListener('DOMContentLoaded', () => {
    const accessToken = getCookie('access_token');

    if (accessToken) {
        fetchReviewData();
    } else {
        console.error('No access token found in cookies');
    }

    document.getElementById('generateReviewBtn').addEventListener('click', () => {
        generateNewReview();
    });
});

function fetchReviewData() {
    console.log("masuk pak")
    fetch('http://localhost:3002/rekomendasiAI', {
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg === 'Query Successful') {
            populateCards(data.data);
        } else {
            console.error('Failed to fetch data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function generateNewReview() {
    try {
        const response = await fetch('http://localhost:3002/askAi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('access_token')
            }
        });
        if (!response.ok) {
            throw new Error('Failed to generate new review');
        }
        const responseData = await response.json(); // Wait for the JSON parsing to complete
        console.log(responseData); // Log the response data
        fetchReviewData()
    } catch (error) {
        console.error('Error:', error);
    }
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
        card.className = 'col-md-6 col-lg-3 mb-4';
        card.innerHTML = `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${item.asal_daerah}</h5>
                    <p class="card-text">Kondisi: ${item.kondisi}%</p>
                    <p class="card-text">Alasan: ${truncateText (item.alasan,50)}</p>
                    <p class="card-text">Rekomendasi: ${truncateText( item.rekomendasi_ai,50)}</p>
                </div>
            </div>
        `;
        chartRow.appendChild(card);
    });
}
