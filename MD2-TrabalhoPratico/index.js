const fs = require('fs').promises;

start();

async function start() {
  await makeFiles();
  //Qual a saída do método que imprime os cinco estados com mais cidades?
  await getStatesWithMoreOrLessCities(true);
  // Qual a saída do método que imprime os cinco estados com menos cidades?
  await getStatesWithMoreOrLessCities(false);
  //Qual a saída do método que imprime a cidade de maior nome de cada estado?
  await getBiggerOrSmallerNameCities(true);
  //Qual a saída do método que imprime a cidade de menor nome de cada estado?
  await getBiggerOrSmallerNameCities(false);
  await getBiggerOrSmallerCityName(true);
  await getBiggerOrSmallerCityName(false);
}

async function makeFiles() {
  let data = await fs.readFile('./json/Estados.json');
  const states = JSON.parse(data);

  data = await fs.readFile('./json/Cidades.json');
  const cities = JSON.parse(data);

  for (state of states) {
    const stateCities = cities.filter((city) => city.Estado === state.ID);
    await fs.writeFile(`./states/${state.Sigla}.json`, JSON.stringify(stateCities)
    );
  }
}

async function getCitiesCount(uf) {
  const data = await fs.readFile(`./states/${uf}.json`);
  const cities = JSON.parse(data);
  return cities.length;
}

async function getStatesWithMoreOrLessCities(more) {//adicionado o parâmetro 'more' para os estados com mais cidades.
  const states = JSON.parse(await fs.readFile('./json/Estados.json'));
  const list = [];

  for (state of states) {
    const count = await getCitiesCount(state.Sigla);
    list.push({ uf: state.Sigla, count });
  }

  list.sort((a, b) => {
    if (a.count < b.count) return 1;
    else if (a.count > b.count) return -1;
    else return 0;
  });

  const result = [];
  //Qual a saída do método que imprime os cinco estados com mais cidades? 
  if (more) {list.slice(0, 5).forEach((item) => result.push(item.uf + ' - ' + item.count));
  } // Qual a saída do método que imprime os cinco estados com menos cidades? 
  else {//caso o parâmetro seja 'false', retornará os cinco últimos
    list.slice(-5).forEach((item) => result.push(item.uf + ' - ' + item.count));
  }

  console.log(result);
}

async function getBiggerOrSmallerNameCities(bigger) {
  const states = JSON.parse(await fs.readFile('./json/Estados.json'));
  const result = [];

  for (state of states) {
    let city;
    if (bigger) {
      //Qual a saída do método que imprime a cidade de maior nome de cada estado?
      city = await getBiggerName(state.Sigla);
    } //Qual a saída do método que imprime a cidade de menor nome de cada estado?
    else {
      city = await getSmallerName(state.Sigla);
    }

    result.push(city.Nome + ' - ' + state.Sigla);
  }
  console.log(result);
}

//obtendo os maiores nomes de cidades em cada estado.
async function getBiggerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) result = city;
    else if (city.Nome.length > result.Nome.length) result = city;//comparando por tamanho
    else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase() //caso tamanho igual, comparação alfabética
    )
      result = city;
  });

  return result;
}

//obtendo os menores nomes de cidades em cada estado.
async function getSmallerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) result = city;
    else if (city.Nome.length < result.Nome.length) result = city;//comparando tamanho "menor que"
    else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    )
      result = city;
  });

  return result;
}

async function getBiggerOrSmallerCityName(bigger) {
  const states = JSON.parse(await fs.readFile('./json/Estados.json'));
  const list = [];
  for (state of states) {
    let city;
    if (bigger) {
      city = await getBiggerName(state.Sigla);
    } else {
      city = await getSmallerName(state.Sigla);
    }
    list.push({ name: city.Nome, uf: state.Sigla });
  }
  const result = list.reduce((before, now) => { //comparando o tamanho do nome anterior com o atual
    if (bigger) {
      if (before.name.length > now.name.length) return before;
      else if (before.name.length < now.name.length) return now;
      else //Qual a saída do método que imprime a cidade de maior nome entre todos os estados? 
        return before.name.toLowerCase() < now.name.toLowerCase() ? before : now; //utilizando o operador ternário.
    } else {
      if (before.name.length < now.name.length) return before;
      else if (before.name.length > now.name.length) return now;
      else //Qual a saída do método que imprime a cidade de menor nome entre todos os estados?
        return before.name.toLowerCase() < now.name.toLowerCase() ? before : now;
    }
  });
  console.log(result.name + ' - ' + result.uf);
}
