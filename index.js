$(`#route`).change(function () {
  $(`#timetable`).removeClass("disabled");
});


// добавление пути обратно при выборе билетов в обе стороны
$(`#route`).change(function () {
  $(`option:selected`).val() == "из A в B и обратно в А"
    ? $(`.wayback-selector`).toggleClass("disabled")
    : $(`.wayback-selector`).addClass("disabled");
});

// блокировка маршрутов из точки противоположной выбору пользователя
$(`#route`).change(function () {
  if ($(`option:selected`).val() == "из A в B") {
    $(`#time option`)
      .toArray()
      .filter(function (option) {
        if (
          $(option)
            .text()
            .match(/\d+?:\d+\(из.B/)
        ) {
          $(option).prop("disabled", true);
        } else {
          $(option).prop("disabled", false);
        }
      });
  }
});

$(`#route`).change(function () {
  if ($(`option:selected`).val() == "из B в A") {
    $(`#time option`)
      .toArray()
      .filter(function (option) {
        if (
          $(option)
            .text()
            .match(/\d+?:\d+\(из.A/)
        ) {
          $(option).prop("disabled", true);
        }
        else{
          $(option).prop("disabled", false);
        }
      });
  }
});


const formatForMoment = function (idOfSelect) {
  return (newTime = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()} ${$(`#${idOfSelect} option:selected`)
    .text()
    .match(/\d+?:\d+/)}:00Z`);
};

const countSum = function () {
  const selectedRoute = $("option:selected").val();
  const ticketCount = $("#num").val();
  const departure = formatForMoment("time");
  const formattedDeparture = moment.utc(departure).format("HH:mm");
  const arrival = formatForMoment("wayback-time");
  let travelDuration;
  let ticketCost;
  let ticketStr;
  selectedRoute !== "из A в B и обратно в А"
    ? ((ticketCost = 700),
      (travelDuration = "Это путешествие займет у вас 50 минут."))
    : ((ticketCost = 1200),
      (travelDuration = "Это путешествие займет у вас 1 час 40 минут."));

  if (ticketCount == 1) {
    ticketStr = "билет";
  }
  if (ticketCount > 1 && ticketCount < 5) {
    ticketStr = "билета";
  }
  if (ticketCount >= 5) {
    ticketStr = "билетов";
  }
  $("#counter").removeClass("disabled");
  if (selectedRoute !== "из A в B и обратно в А") {
    $("#counter")
      .text(`Вы выбрали ${ticketCount} ${ticketStr} по маршруту ${selectedRoute} стоимостью ${
      ticketCount * ticketCost
    }р
  ${travelDuration}
  Теплоход отправляется в ${formattedDeparture}, прибытие в ${moment
      .utc(departure)
      .add(50, "minutes")
      .format("HH:mm")}`);
  } else {
    $("#counter")
      .text(`Вы выбрали ${ticketCount} ${ticketStr} по маршруту ${selectedRoute} стоимостью ${
      ticketCount * ticketCost
    }р. 
  ${travelDuration}
  Теплоход отправляется в ${formattedDeparture}, прибытие в ${moment
      .utc(arrival)
      .add(50, "minutes")
      .format("HH:mm")}`);
  }
};

const changeToClientsTime = function () {
  let time = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()} ${$(this)
    .text()
    .match(/\d+?:\d+/)}:00Z`;

  $(this).text(
    $(this)
      .text()
      .replace(/\d+?:\d+/, moment(time).local().format("HH:mm"))
  );
};

$("#time option").each(changeToClientsTime);
$("#wayback-time option").each(changeToClientsTime);


// блокировка маршрутов на которые пользователь не успеет
$(`#route`).change(function () {
  if ($(`option:selected`).val() == "из A в B и обратно в А") {
    $(`#time`).change(function () {
      const departure = `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()} ${$(`#time option:selected`)
        .val()
        .match(/\d+?:\d+/)}:00Z`;
      $("#wayback-time option")
        .toArray()
        .filter(function (time) {
          const comparingTime = `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${
            $(time)
              .val()
              .match(/\d+?:\d+/)[0]
          }:00Z`;
          const comparedVar = moment
            .utc(moment(comparingTime).diff(moment(departure)))
            .format("HH:mm");
            console.log(moment.duration(comparedVar).asMinutes());
          if (
            moment.duration(comparedVar).asMinutes() < 50 ||
            moment.duration(comparedVar).asMinutes() > 1000
          ) {
            $(time).prop("disabled", true)
          }
          else{
           $(time).prop("disabled", false);
          }
        });
    });
  }
});

$("#count").on("click", countSum);
