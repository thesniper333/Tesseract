document.addEventListener('DOMContentLoaded', function() {
    // Get current date
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Render calendar
    renderCalendar(currentMonth, currentYear);

    function renderCalendar(month, year) {
        const monthYearElement = document.getElementById('month-year');
        const daysGridElement = document.getElementById('days-grid');

        // Clear previous days
        daysGridElement.innerHTML = '';

        // Set month and year in header
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        monthYearElement.textContent = `${monthNames[month]} ${year}`;

        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Get days from previous month to show
        const prevMonthDays = new Date(year, month, 0).getDate();
        let daysFromPrevMonth = firstDay;

        // Get days from next month to show
        const totalCells = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
        const daysFromNextMonth = totalCells - (daysInMonth + daysFromPrevMonth);

        // Add days from previous month
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const dayElement = createDayElement(prevMonthDays - i, false);
            daysGridElement.appendChild(dayElement);
        }

        // Add days from current month
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
            const dayElement = createDayElement(i, true, isToday);
            daysGridElement.appendChild(dayElement);
        }

        // Add days from next month
        for (let i = 1; i <= daysFromNextMonth; i++) {
            const dayElement = createDayElement(i, false);
            daysGridElement.appendChild(dayElement);
        }
    }

    function createDayElement(dayNumber, isCurrentMonth, isToday = false) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = dayNumber;

        if (isCurrentMonth) {
            dayElement.classList.add('current-month');
        } else {
            dayElement.classList.add('other-month');
        }

        if (isToday) {
            dayElement.classList.add('today');
        }

        return dayElement;
    }
});
