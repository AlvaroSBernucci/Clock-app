const dynamicBG = document.querySelector('.dynamic-bg');
const loader = document.getElementById('loader');
const btn = document.querySelector('button');
const detailBG = document.querySelector('.detail-bg')

function initGeolocation(){
  if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition((position) =>{
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      const query = `${lat},${long}`;
      fetchLocation(query);
    },
    (err) => console.log(err,'Sem Localização'))
  }else{
    alert('não');
  }
}
  function loaderOff(){
    loader.style.display = 'none';
    dynamicBG.style.display = 'grid';
  }
  async function fetchLocation(query){
    const accessKey ='1c4c47fbd2504676d619c14ab3f4a53f';
    const url = `https://api.positionstack.com/v1/reverse?access_key=${accessKey}&query=${query}&timezone_module=1&country_module=1`
    const locationData = await fetch(url);
    const locationJSON = await locationData.json();
    const timeZone = locationJSON.data[0].timezone_module.name;
    const cidade = locationJSON.data[0].locality;
    const pais = locationJSON.data[0].country_module.global.alpha2;
    fetchTime(pais,cidade,timeZone);
  }
  

async function fetchTime(pais,cidade,timeZone){
  const timeData = await fetch(`https://worldtimeapi.org/api/${timeZone}`);
  const dataJSON = await timeData.json();
  const detailInfos = [dataJSON.timezone.replace('_', ' '),dataJSON.day_of_week,dataJSON.day_of_year,dataJSON.week_number];
  const date = new Date(dataJSON.datetime);
  const hora = date.getHours();
  const minutosFormatados = date.getMinutes().toString().padStart(2,'0');
  const horario = `${hora}:${minutosFormatados}`;
  loaderOff();
  trocarInformacoes(pais,cidade,hora,horario,detailInfos);
}






function trocarInformacoes(pais,cidade,hora,horario,detailInfos){
  const frase = document.getElementById('frase');
  const hour = document.getElementById('hour');
  const location = document.getElementById('location');
  const locationInfos = document.querySelectorAll('.detail-infos h2')
  if(hora >= 18){
    dynamicBG.classList.toggle('night');
    detailBG.classList.toggle('night');
    frase.innerText = 'EVENING'
  } else if (hora >= 12){
    frase.innerText = 'AFTERNOON'
  }
  hour.innerText = horario;
  location.innerText = `in ${cidade}, ${pais}`
  
  locationInfos.forEach((info,index) => {
    info.innerText = detailInfos[index];
  })
}



function handleClick(event){
  event.preventDefault();
  const blockquote = document.querySelector('blockquote');
  blockquote.classList.toggle('ativo');
  detailBG.classList.toggle('ativo');
  btnText(event.target);
}

function btnText(element){
  const oldValue = element.innerText;
  const newValue = element.dataset.btntxt;
  element.innerText = newValue;
  element.dataset.btntxt = oldValue;
}

btn.addEventListener('click',handleClick)

initGeolocation()
