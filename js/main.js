$(function () {
    $('.slider').slick({
        autoplay: true,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 300,
        fade: true,
        cssEase: 'linear'
    });
});

$(function () {
    $(".toggle_btn").on("click", function () {
        $("#header,.open_wrapper").toggleClass("open")
    });

    $(window).scroll(function () {
        // fadeinクラスに対して順に処理を行う
        $(".fadein").each(function () {
            // スクロールした距離
            let scroll = $(window).scrollTop();
            // fadeinクラスの要素までの距離
            let target = $(this).offset().top;
            // 画面の高さ
            let windowHeight = $(window).height();
            // fadeinクラスの要素が画面下にきてから200px通過した
            // したタイミングで要素を表示
            if (scroll > target - windowHeight + 200) {
                $(this).css("opacity", "1");
                $(this).css("transform", "translateY(0)");
            }
        });
    });
});



const date = new Date();
const today = date.getDate();
const currentMonth = date.getMonth();
const currentYear = date.getFullYear();

// 祝日判定関数（簡易版）
function isHoliday(year, month, day) {
    const holidays = [
        { month: 1, day: 1 },   // 元日
        { month: 2, day: 11 },  // 建国記念の日
        { month: 2, day: 23 },  // 天皇誕生日
        { month: 4, day: 29 },  // 昭和の日
        { month: 5, day: 3 },   // 憲法記念日
        { month: 5, day: 4 },   // みどりの日
        { month: 5, day: 5 },   // こどもの日
        { month: 8, day: 11 },  // 山の日
        { month: 11, day: 3 },  // 文化の日
        { month: 11, day: 23 }, // 勤労感謝の日
    ];
    for (let holiday of holidays) {
        if (month === holiday.month - 1 && day === holiday.day) {
            return true;
        }
    }
    return false;
}

function createCalendar(year, month) {
    const weekDays = ["月", "火", "水", "木", "金", "土", "日"];
    let calendarHTML = '<table class="calendar"><thead><tr>';
    for (let i = 0; i < 7; i++) {
        let thClass = "";
        if (weekDays[i] === "土") {
            thClass = "sat";
        } else if (weekDays[i] === "日") {
            thClass = "sun";
        }
        calendarHTML += `<th class="${thClass}">${weekDays[i]}</th>`;
    }
    calendarHTML += '</tr></thead><tbody>';

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    let adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // 月曜始まりに調整
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let dayCount = 1;
    let prevDayCount = daysInPrevMonth - adjustedFirstDay + 1;

    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < adjustedFirstDay) {
                // 前月
                calendarHTML += `<td class="mute"><span class="date-num">${prevDayCount}</span></td>`;
                prevDayCount++;
            } else if (dayCount > daysInMonth) {
                // 翌月
                let nextMonthDayCount = dayCount - daysInMonth;
                calendarHTML += `<td class="mute"><span class="date-num">${nextMonthDayCount}</span></td>`;
                dayCount++;
            } else {
                // 休診日判定（木曜: j==3, 日曜: j==6, 祝日）
                let isClosed = (j === 3 || j === 6 || isHoliday(year, month, dayCount));
                let tdClass = "";
                if (dayCount === today && month === currentMonth && year === currentYear) {
                    tdClass += "today";
                }
                calendarHTML += `<td class="${tdClass}">`;
                calendarHTML += `<span class="date-num">${dayCount}</span>`;
                if (isClosed) {
                    calendarHTML += `<span class="closed-label">休診日</span>`;
                }
                calendarHTML += `</td>`;
                dayCount++;
            }
        }
        calendarHTML += '</tr>';
        if (dayCount > daysInMonth) break;
    }
    calendarHTML += '</tbody></table>';
    return calendarHTML;
}

document.getElementById('calendar').innerHTML = createCalendar(currentYear, currentMonth);
