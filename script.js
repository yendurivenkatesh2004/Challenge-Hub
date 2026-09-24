const challenges = [
    {
        id: 1,
        title: "Study for 30 Minutes",
        description: "Focus on your studies without distractions.",
        category: "Study",
        icon: "📚",
        xp: 50
    },
    {
        id: 2,
        title: "Read 10 Pages",
        description: "Read a book for at least 10 pages.",
        category: "Study",
        icon: "📖",
        xp: 50
    },
    {
        id: 3,
        title: "Do 20 Exercises",
        description: "Complete 20 simple exercises.",
        category: "Fitness",
        icon: "💪",
        xp: 40
    },
    {
        id: 4,
        title: "Go for a Walk",
        description: "Take a refreshing 20-minute walk.",
        category: "Fitness",
        icon: "🚶",
        xp: 40
    },
    {
        id: 5,
        title: "Draw Something",
        description: "Create an original drawing.",
        category: "Creativity",
        icon: "🎨",
        xp: 60
    },
    {
        id: 6,
        title: "Create Something New",
        description: "Make something you've never made before.",
        category: "Creativity",
        icon: "💡",
        xp: 80
    },
    {
        id: 7,
        title: "Help Someone",
        description: "Do something helpful for another person.",
        category: "Kindness",
        icon: "❤️",
        xp: 70
    },
    {
        id: 8,
        title: "Give a Compliment",
        description: "Make someone's day with a genuine compliment.",
        category: "Kindness",
        icon: "😊",
        xp: 30
    },
    {
        id: 9,
        title: "Learn Something Random",
        description: "Learn an interesting new fact.",
        category: "Fun",
        icon: "🧠",
        xp: 40
    },
    {
        id: 10,
        title: "Complete a Puzzle",
        description: "Solve a puzzle or brain teaser.",
        category: "Fun",
        icon: "🧩",
        xp: 60
    }
];

const badges = [
    {
        name: "First Step",
        icon: "🚀",
        requirement: 1,
        text: "Complete your first challenge."
    },
    {
        name: "Getting Started",
        icon: "🌟",
        requirement: 3,
        text: "Complete 3 challenges."
    },
    {
        name: "Challenge Pro",
        icon: "🔥",
        requirement: 5,
        text: "Complete 5 challenges."
    },
    {
        name: "Challenge Master",
        icon: "👑",
        requirement: 10,
        text: "Complete 10 challenges."
    },
    {
        name: "XP Hunter",
        icon: "💎",
        requirement: 250,
        type: "xp",
        text: "Earn 250 XP."
    },
    {
        name: "XP Legend",
        icon: "🏆",
        requirement: 500,
        type: "xp",
        text: "Earn 500 XP."
    }
];

let user = {
    username: "",
    xp: 0,
    completed: [],
    streak: 0
};


// LOGIN

function login() {

    const name = document.getElementById("usernameInput").value.trim();

    if (!name) {
        alert("Please enter a username.");
        return;
    }

    user.username = name;

    localStorage.setItem("challengeUser", JSON.stringify(user));

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    updateUI();
}


// LOAD USER

function loadUser() {

    const saved = localStorage.getItem("challengeUser");

    if (saved) {

        user = JSON.parse(saved);

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");

        updateUI();
    }
}


// NAVIGATION

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    updateUI();
}


// RENDER CHALLENGES

function renderChallenges(list = challenges) {

    const grid = document.getElementById("challengeGrid");

    grid.innerHTML = "";

    list.forEach(challenge => {

        const completed = user.completed.includes(challenge.id);

        grid.innerHTML += `
            <div class="challenge-card">

                <div class="challenge-icon">${challenge.icon}</div>

                <span class="category">${challenge.category}</span>

                <h3>${challenge.title}</h3>

                <p>${challenge.description}</p>

                <div class="reward">
                    ⭐ +${challenge.xp} XP
                </div>

                <button
                    class="complete-btn ${completed ? "completed-btn" : ""}"
                    onclick="completeChallenge(${challenge.id})"
                    ${completed ? "disabled" : ""}
                >
                    ${completed ? "✓ Completed" : "Complete Challenge"}
                </button>

            </div>
        `;
    });
}


// HOME CHALLENGES

function renderHomeChallenges() {

    const grid = document.getElementById("homeChallenges");

    grid.innerHTML = "";

    challenges.slice(0, 3).forEach(challenge => {

        const completed = user.completed.includes(challenge.id);

        grid.innerHTML += `
            <div class="challenge-card">

                <div class="challenge-icon">${challenge.icon}</div>

                <span class="category">${challenge.category}</span>

                <h3>${challenge.title}</h3>

                <p>${challenge.description}</p>

                <div class="reward">
                    ⭐ +${challenge.xp} XP
                </div>

                <button
                    class="complete-btn ${completed ? "completed-btn" : ""}"
                    onclick="completeChallenge(${challenge.id})"
                    ${completed ? "disabled" : ""}
                >
                    ${completed ? "✓ Completed" : "Complete Challenge"}
                </button>

            </div>
        `;
    });
}


// COMPLETE CHALLENGE

function completeChallenge(id) {

    if (user.completed.includes(id)) {
        return;
    }

    const challenge = challenges.find(item => item.id === id);

    user.completed.push(id);
    user.xp += challenge.xp;

    updateStreak();

    saveUser();
    updateUI();

    showToast(`🎉 +${challenge.xp} XP earned!`);
}


// STREAK

function updateStreak() {

    user.streak = Math.min(user.completed.length, 30);

}


// FILTER

function filterChallenges(category, button) {

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    if (category === "All") {
        renderChallenges(challenges);
    } else {
        renderChallenges(
            challenges.filter(challenge => challenge.category === category)
        );
    }
}


// BADGES

function renderBadges() {

    const grid = document.getElementById("badgeGrid");

    grid.innerHTML = "";

    badges.forEach(badge => {

        let unlocked;

        if (badge.type === "xp") {
            unlocked = user.xp >= badge.requirement;
        } else {
            unlocked = user.completed.length >= badge.requirement;
        }

        grid.innerHTML += `
            <div class="badge ${unlocked ? "" : "locked"}">

                <div class="badge-icon">${badge.icon}</div>

                <h3>${badge.name}</h3>

                <p>${badge.text}</p>

                <br>

                ${unlocked ? "✅ Unlocked" : "🔒 Locked"}

            </div>
        `;
    });
}


// UPDATE UI

function updateUI() {

    const level = Math.floor(user.xp / 500) + 1;
    const currentXP = user.xp % 500;
    const percentage = (currentXP / 500) * 100;

    document.getElementById("homeUsername").textContent = user.username;

    document.getElementById("profileUsername").textContent = user.username;

    document.getElementById("leaderUsername").textContent = user.username;

    document.getElementById("avatar").textContent =
        user.username.charAt(0).toUpperCase();

    document.getElementById("level").textContent = level;

    document.getElementById("xpText").textContent = currentXP;

    document.getElementById("xpBar").style.width = percentage + "%";

    document.getElementById("streak").textContent = user.streak;

    document.getElementById("totalXP").textContent = user.xp;

    document.getElementById("completed").textContent =
        user.completed.length;

    document.getElementById("badgeCount").textContent =
        getBadgeCount();

    document.getElementById("profileXP").textContent = user.xp;

    document.getElementById("profileCompleted").textContent =
        user.completed.length;

    document.getElementById("profileStreak").textContent =
        user.streak;

    document.getElementById("leaderXP").textContent =
        user.xp + " XP";

    renderChallenges();
    renderHomeChallenges();
    renderBadges();
}


// BADGE COUNT

function getBadgeCount() {

    return badges.filter(badge => {

        if (badge.type === "xp") {
            return user.xp >= badge.requirement;
        }

        return user.completed.length >= badge.requirement;

    }).length;
}


// SAVE

function saveUser() {

    localStorage.setItem(
        "challengeUser",
        JSON.stringify(user)
    );
}


// LOGOUT

function logout() {

    localStorage.removeItem("challengeUser");

    location.reload();
}


// DARK MODE

function toggleTheme() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem("darkMode", dark);
}


// TOAST

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// START

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

loadUser();