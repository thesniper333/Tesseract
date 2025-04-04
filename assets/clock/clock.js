// Clock Script

/* Adding numbers dynamically */
for (let i = 1; i <= 12; i++) {
    const angle = (i * 30) * (Math.PI / 180);
    const x = 50 + 40 * Math.sin(angle); // Calculate X position
    const y = 50 - 40 * Math.cos(angle); // Calculate Y position
    document.getElementById("clock").innerHTML += `<div class="number" style="top: ${y}%; left: ${x}%">${i}</div>`;
}

/* Adding clock hands */
document.getElementById("clock").innerHTML += `<div class="hand hour" id="hour"></div>
                                               <div class="hand minute" id="minute"></div>
                                               <div class="hand second" id="second"></div>
                                               <div class="center"></div>`;



/* Function to update clock hands based on current time */
function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    /* Calculate rotation angles for each hand */
    const hourDeg = (360 / 12) * hours + (30 / 60) * minutes;
    const minuteDeg = (360 / 60) * minutes + (6 / 60) * seconds;
    const secondDeg = (360 / 60) * seconds;

    /* Apply rotation to clock hands */
    document.getElementById("hour").style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    document.getElementById("minute").style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    document.getElementById("second").style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
}

/* Update clock every second */
setInterval(updateClock, 1000);
updateClock(); // Initialize immediately
