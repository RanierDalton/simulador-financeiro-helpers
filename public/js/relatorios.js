async function carregarSetores() {
    try {
      // Obtém o idEmpresa do sessionStorage
      const idEmpresa = sessionStorage.getItem('ID_EMPRESA');
  
      // Verifica se o idEmpresa está presente no sessionStorage
      if (!idEmpresa) {
          console.error('ID da empresa não encontrado no sessionStorage');
          return;
      }
  
      // Faz a requisição para a rota que retorna os setores
      const response = await fetch(`/dashboard/setores/${idEmpresa}`);
      
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
          throw new Error('Erro ao obter setores');
      }
  
      // Converte a resposta para JSON
      const data = await response.json();
  
      // Verifica se há setores na resposta
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          // Seleciona o elemento <select> pelo ID
          const selectElement = document.getElementById('fkSetor');
          const selectElement2 = document.getElementById('fkSetor2');
  
          // Limpa o conteúdo do <select> antes de adicionar novas opções
          selectElement.innerHTML = '';
  
          // Adiciona uma opção para cada setor
          data.data.forEach(setor => {
              const option = document.createElement('option');
              option.value = setor.idSetor;  // O valor da opção é o id do setor
              option.textContent = setor.Nome;  // O texto da opção é o nome do setor
              selectElement.appendChild(option);
          });
          data.data.forEach(setor => {
              const option = document.createElement('option');
              option.value = setor.idSetor;  // O valor da opção é o id do setor
              option.textContent = setor.Nome;  // O texto da opção é o nome do setor
              selectElement2.appendChild(option);
          });
          
          const idSetor = selectElement.value; // Pegue o valor do setor selecionado
          await preencherSelect(idSetor); // Chama para preencher as máquinas e carregar o gráfico
  
      } else {
          console.log('Nenhum setor encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    }
}

carregarSetores();

async function preencherSelect(idSetor) {
    try {
      // Faz a requisição para obter as máquinas do setor
      const response = await fetch(`/dashboard/maquinas/${idSetor}`);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const data = await response.json();
    
      // Seleciona o elemento <select> para preencher
      const select = document.getElementById('fkMaquina');
      select.innerHTML = ''; // Limpa o conteúdo atual do select
      
      // Preenche o select com as máquinas
      data.data.forEach((maquina, index) => {
        const option = document.createElement('option');
        option.value = maquina.idMaquina;
        option.textContent = maquina.nome;
        
        // Marca a primeira opção como selecionada
        if (index === 0) {
          option.selected = true;
        }
        select.appendChild(option);
      });
  
    } catch (error) {
      console.error('Erro ao preencher o select:', error);
    }
}

document.getElementById('fkSetor2').addEventListener('change', async (event) => {
    const idSetor = event.target.value;  // Obtém o id do setor selecionado
    await preencherSelect(idSetor);  // Preenche as máquinas e atualiza o gráfico
});

function carregarRelatorios() {
    fetch("/relatorios/relatorios").then(function (resposta) {
        if (resposta.ok) {
            if (resposta.status == 204) {
                throw "Nenhum resultado encontrado!";
            }

            resposta.json().then(function (dados) {
                const tabela = document.querySelector('.relatorios');
                tabela.querySelectorAll('tr:not(:first-child)').forEach(function (linha) {
                    linha.remove();
                });
                for (var i = 0; i < dados.length; i++) {
                    var formatoData = new Date(dados[i].horario).toLocaleDateString("PT-BR", { hour: "2-digit", minute: "2-digit" });

                    var novaLinha = document.createElement('tr');

                    var celulaHorario = document.createElement('td');
                    celulaHorario.textContent = formatoData;

                    var celulaMaquina = document.createElement('td');
                    celulaMaquina.textContent = dados[i].maquina;

                    var celulaTemperatura = document.createElement('td');
                    celulaTemperatura.textContent = dados[i].temp;

                    var celulaStatus = document.createElement('td');
                    celulaStatus.textContent = dados[i].Stats;

                    // Modifica a cor do texto do status de acordo com seu valor
                    switch (dados[i].Stats) {
                        case "OK":
                            celulaStatus.style.color = "green";  // Verde para OK
                            break;
                        case "Superaquecimento":
                            celulaStatus.style.color = "red";  // Vermelho para superaquecimento
                            break;
                        case "Resfriamento":
                            celulaStatus.style.color = "blue";  // Azul para resfriamento
                            break;
                        default:
                            celulaStatus.style.color = "black";  // Cor padrão
                    }

                    novaLinha.appendChild(celulaHorario);
                    novaLinha.appendChild(celulaMaquina);
                    novaLinha.appendChild(celulaTemperatura);
                    novaLinha.appendChild(celulaStatus);
                    
                    tabela.appendChild(novaLinha);
                }
            });
        } else {
            throw ('Houve um erro na API!');
        }
    }).catch(function (erro) {
        console.error(erro);
    });
}

function carregarRelatoriosFiltro() {
    const inicio = document.getElementById('horarioInicio').value;
    const final = document.getElementById('horarioFinal').value;
    const setor = document.getElementById('fkSetor').value;
    
    // Formata as datas corretamente
    const inicioDate = `${inicio} 00:00:00`;
    const finalDate = `${final} 23:59:59`;

    // Faz o fetch passando as variáveis de filtro para o backend
    fetch('/relatorios/filtrado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inicioServer: inicioDate,
            finalServer: finalDate,
            setorServer: setor
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            throw "Erro ao obter os relatórios filtrados!";
        }
    })
    .then(function (dados) {

        const tabela = document.querySelector('.relatorios');
        
        // Remove as linhas anteriores da tabela
        tabela.querySelectorAll('tr:not(:first-child)').forEach(function (linha) {
            linha.remove();
        });

        // Preenche a tabela com os dados recebidos
        dados.forEach(function (item) {
            var formatoData = new Date(item.horario).toLocaleDateString("PT-BR", { hour: "2-digit", minute: "2-digit" });

            var novaLinha = document.createElement('tr');
            
            var celulaHorario = document.createElement('td');
            celulaHorario.textContent = formatoData;
            
            var celulaMaquina = document.createElement('td');
            celulaMaquina.textContent = item.maquina;

            var celulaTemperatura = document.createElement('td');
            celulaTemperatura.textContent = item.temp;

            var celulaStatus = document.createElement('td');
            celulaStatus.textContent = item.Stats;

            // Modifica a cor do texto do status de acordo com seu valor
            switch (item.Stats) {
                case "OK":
                    celulaStatus.style.color = "green";  // Verde para OK
                    break;
                case "Superaquecimento":
                    celulaStatus.style.color = "red";  // Vermelho para superaquecimento
                    break;
                case "Resfriamento":
                    celulaStatus.style.color = "blue";  // Azul para resfriamento
                    break;
                default:
                    celulaStatus.style.color = "black";  // Cor padrão
            }

            novaLinha.appendChild(celulaHorario);
            novaLinha.appendChild(celulaMaquina);
            novaLinha.appendChild(celulaTemperatura);
            novaLinha.appendChild(celulaStatus);

            tabela.appendChild(novaLinha);
        });
    })
    .catch(function (erro) {
        console.error(erro);
    });
}

function carregarFiltroMaquina() {
    const maquina = document.getElementById('fkMaquina').value;

    fetch('/relatorios/filtrado/maquina', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            maquinaServer: maquina
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            throw "Erro ao obter os relatórios filtrados!";
        }
    })
    .then(function (dados) {

        const tabela = document.querySelector('.relatorios');
        
        // Remove as linhas anteriores da tabela
        tabela.querySelectorAll('tr:not(:first-child)').forEach(function (linha) {
            linha.remove();
        });

        // Preenche a tabela com os dados recebidos
        dados.forEach(function (item) {
            var formatoData = new Date(item.horario).toLocaleDateString("PT-BR", { hour: "2-digit", minute: "2-digit" });

            var novaLinha = document.createElement('tr');
            
            var celulaHorario = document.createElement('td');
            celulaHorario.textContent = formatoData;
            
            var celulaMaquina = document.createElement('td');
            celulaMaquina.textContent = item.maquina;

            var celulaTemperatura = document.createElement('td');
            celulaTemperatura.textContent = item.temp;

            var celulaStatus = document.createElement('td');
            celulaStatus.textContent = item.Stats;

            // Modifica a cor do texto do status de acordo com seu valor
            switch (item.Stats) {
                case "OK":
                    celulaStatus.style.color = "green";  // Verde para OK
                    break;
                case "Superaquecimento":
                    celulaStatus.style.color = "red";  // Vermelho para superaquecimento
                    break;
                case "Resfriamento":
                    celulaStatus.style.color = "blue";  // Azul para resfriamento
                    break;
                default:
                    celulaStatus.style.color = "black";  // Cor padrão
            }

            novaLinha.appendChild(celulaHorario);
            novaLinha.appendChild(celulaMaquina);
            novaLinha.appendChild(celulaTemperatura);
            novaLinha.appendChild(celulaStatus);

            tabela.appendChild(novaLinha);
        });
    })
    .catch(function (erro) {
        console.error(erro);
    });
}


carregarRelatorios();
