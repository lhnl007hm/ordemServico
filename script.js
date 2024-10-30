document.getElementById('contrato').addEventListener('change', function() {
    const contrato = this.value;
    const endOutput = document.getElementById('endOutput');
    const estOutput = document.getElementById('estOutput');

    endOutput.textContent = '';
    estOutput.textContent = '';

    if (contrato) {
        switch (contrato) {
            case 'PZL':
                endOutput.textContent = 'Rua A';
                estOutput.textContent = 'SP';
                break;
            case 'CEIC':
                endOutput.textContent = 'Rua B';
                estOutput.textContent = 'SP';
                break;
            case 'CAT':
                endOutput.textContent = 'Rua C';
                estOutput.textContent = 'RJ';
                break;
        }
    }
});

function limitLength(input) {
    const value = input.value.toString();
    if (value.length > 6) {
        input.value = value.slice(0, 6);
    }
}

const dataInput = document.getElementById('dataDia');
const dataAtual = new Date().toISOString().split('T')[0];
dataInput.value = dataAtual;

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
    });
}

async function gerarRelatorio() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margemEsquerda = 15;
    let posicaoY = 20;

    const jciLogoDataUrl = await loadImage("/imagens/jciLogo.png");
    const itauLogoDataUrl = await loadImage("/imagens/itauLogo.png");

    //Largura das imagens
    const larguraJCILogo = 50;
    const larguraItauLogo = 30;

    doc.addImage(jciLogoDataUrl, 'PNG', margemEsquerda, 10, larguraJCILogo, 30);
    doc.setFont("helvetica", "bold");
    const textoCabecalho = "ORDEM DE SERVIÇO";
    const textoCabecalhoWidth = doc.getTextWidth(textoCabecalho);
    doc.text(textoCabecalho, (doc.internal.pageSize.getWidth() / 2) - (textoCabecalhoWidth / 2), 30);

    //Calculando a posição X logo Itaú
    const posicaoItauLogoX = doc.internal.pageSize.getWidth() - larguraItauLogo - margemEsquerda;

    doc.addImage(itauLogoDataUrl, 'PNG', posicaoItauLogoX, 10, larguraItauLogo, 30);

    posicaoY += 20;
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, posicaoY, margemEsquerda + 180, posicaoY);
    posicaoY += 5;
    doc.setFontSize(12);

    const nOS = document.getElementById('nOS').value;
    const dataDia = document.getElementById('dataDia').value;
    const contrato = document.getElementById('contrato').value;
    const endereco = document.getElementById('endOutput').textContent;
    const estado = document.getElementById('estOutput').textContent;
    const avariado = document.getElementById('avariado').value;
    const equiNec = document.getElementById('equiNec').value;
    const alimEntrada = document.getElementById('alimEntrada').value;
    const alimCom = document.getElementById('alimCom').value;
    const alimOpe = document.getElementById('alimOpe').value;
    const limpeza = document.getElementById('limpeza').value;
    const ledsSin = document.getElementById('ledsSin').value;
    const reapBornes = document.getElementById('reapBornes').value;
    const equipAfetados = document.getElementById('equipAfetados').value;
    const descricao = document.getElementById('descricao').value;
    const sitOS = document.getElementById('sitOS').value;
    const dataProx = document.getElementById('dataProx').value;
    const tpServico = document.querySelector('input[name="tpServico"]:checked');
    const tipoServico = tpServico ? tpServico.parentElement.textContent.trim() : "Não selecionado";
    // Captura a imagem do input
    const fotoInput = document.getElementById('fotoInput').files[0];
    let fotoDataUrl = null;

    // Se uma foto foi selecionada, converta para base64
    if (fotoInput) {
        const reader = new FileReader();
        fotoDataUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(fotoInput);
        });
    }

    function formatarData(data) {
        const partes = data.split('-'); // Divide a data no formato aaaa-mm-dd
        if (partes.length === 3) {
            const dia = partes[2];   // Dia
            const mes = partes[1];   // Mês
            const ano = partes[0];   // Ano
            return `${dia}/${mes}/${ano}`; // Retorna a data no formato desejado
        }
        return data; // Retorna a data original se não estiver no formato esperado
    }

    const dataFormatada = formatarData(dataProx);
    const dataFormatadaDia = formatarData(dataDia);

    function addSectionInLine(label1, value1, label2, value2, label3, value3) {
        const largura1 = 60; // Largura para N° OS
        const largura2 = 60; // Largura para Data
        const largura3 = 60; // Largura para Contrato
        const altura = 10; // Altura ajustada para 10

        if (posicaoY + altura > doc.internal.pageSize.height - 20) {
            doc.addPage();
            posicaoY = 20;
        }

        doc.setDrawColor(0);
        doc.setLineWidth(0.1);

        doc.rect(margemEsquerda, posicaoY, largura1, altura);
        doc.setFont("helvetica", "bold");
        doc.text(label1 + ":", margemEsquerda + 5, posicaoY + 8);
        doc.setFont("helvetica", "normal");
        doc.text(value1, margemEsquerda + 20, posicaoY + 8); 

        doc.rect(margemEsquerda + largura1, posicaoY, largura2, altura);
        doc.setFont("helvetica", "bold");
        doc.text(label2 + ":", margemEsquerda + largura1 + 5, posicaoY + 8);
        doc.setFont("helvetica", "normal");
        doc.text(value2, margemEsquerda + largura1 + 20, posicaoY + 8); 

        doc.rect(margemEsquerda + largura1 + largura2, posicaoY, largura3, altura);
        doc.setFont("helvetica", "bold");
        doc.text(label3 + ":", margemEsquerda + largura1 + largura2 + 5, posicaoY + 8);
        doc.setFont("helvetica", "normal");
        doc.text(value3, margemEsquerda + largura1 + largura2 + 25, posicaoY + 8); 

        posicaoY += altura;
    }

    function addSectionInLineTwoCols(label1, value1, label2, value2) {
        const largura1 = 120; // Largura para Endereço
        const largura2 = 60; // Largura para Estado
        const altura = 10; // Altura ajustada para 10

        doc.setDrawColor(0);
        doc.setLineWidth(0.1);

        doc.rect(margemEsquerda, posicaoY, largura1, altura);
        doc.setFont("helvetica", "bold");
        doc.text(label1 + ":", margemEsquerda + 5, posicaoY + 8);
        doc.setFont("helvetica", "normal");
        doc.text(value1, margemEsquerda + 30, posicaoY + 8); 

        doc.rect(margemEsquerda + largura1, posicaoY, largura2, altura);
        doc.setFont("helvetica", "bold");
        doc.text(label2 + ":", margemEsquerda + largura1 + 5, posicaoY + 8);
        doc.setFont("helvetica", "normal");
        doc.text(value2, margemEsquerda + largura1 + 25, posicaoY + 8); 

        posicaoY += altura + 5; // Ajustado para manter espaçamento
    }

    addSectionInLine("Nº OS", nOS, "Data", dataFormatadaDia, "Contrato", contrato);
    addSectionInLineTwoCols("Endereço", endereco, "Estado", estado);

    // Linha para "Tipo de Serviço"
    posicaoY -= 5;
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.rect(margemEsquerda, posicaoY, 180, 10); // Altura ajustada para 10
    doc.setFont("helvetica", "bold");
    doc.text("Tipo de Serviço:", margemEsquerda + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");

    // Adiciona opções de serviço
    const opcoes = ["Preventiva", "Corretiva", "Melhoria"];
    let posicaoX = margemEsquerda + 50;
    const espacoEntreOpcoes = 40;

    opcoes.forEach((opcao) => {
        if (tpServico && tpServico.id === opcao.toLowerCase()) {
            doc.setTextColor(0, 128, 0);
            doc.text(opcao, posicaoX, posicaoY + 8);
            doc.setTextColor(0, 0, 0);
        } else {
            doc.text(opcao, posicaoX, posicaoY + 8);
        }
        posicaoX += espacoEntreOpcoes;
    });

    posicaoY += 10;

    // Captura os valores de Equipamento, Descrição e TAG
    const equipamento = document.getElementById('equipamento').value;
    const descricaoEquipamento = document.getElementById('descEquip').value;
    const tagEquipamento = document.getElementById('TAGEquipamento').value;

    // Linha para "Equipamento", "Descrição Equipamento" e "TAG Equipamento"
    const larguraEquipamento = 60; // Ajustado para ocupar parte da linha
    const larguraDescricao = 60; // Ajustado para ocupar parte da linha
    const larguraTag = 60; // Ajustado para ocupar parte da linha
    const alturaEquipamento = 20; // Aumentado apenas para esta seção

    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    // Adiciona linha para Equipamento
    doc.rect(margemEsquerda, posicaoY, larguraEquipamento, alturaEquipamento);
    doc.setFont("helvetica", "bold");
    doc.text("Equipamento:", margemEsquerda + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(equipamento, margemEsquerda + 5, posicaoY + 14); 

    // Adiciona linha para Descrição Equipamento
    doc.rect(margemEsquerda + larguraEquipamento, posicaoY, larguraDescricao, alturaEquipamento);
    doc.setFont("helvetica", "bold");
    doc.text("Descrição Equipamento:", margemEsquerda + larguraEquipamento + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(descricaoEquipamento, margemEsquerda + larguraEquipamento + 5, posicaoY + 14); 

    // Adiciona linha para TAG
    doc.rect(margemEsquerda + larguraEquipamento + larguraDescricao, posicaoY, larguraTag, alturaEquipamento);
    doc.setFont("helvetica", "bold");
    doc.text("TAG Equipamento:", margemEsquerda + larguraEquipamento + larguraDescricao + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(tagEquipamento, margemEsquerda + larguraEquipamento + larguraDescricao + 5, posicaoY + 14); 

    posicaoY += alturaEquipamento; // Move a posição Y para baixo após adicionar a seção

    // Adiciona linha para "Adicionar Foto"
    const alturaFoto = 60; // Altura ajustada para 50
    const larguraFoto = 90; // Largura ajustada para 60
    const larguraAvariado = 45;
    const larguraEquipNec = 45;
    const alturaAvaEqui = 10;

    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.rect(margemEsquerda, posicaoY, larguraFoto, alturaFoto);
    doc.setFont("helvetica", "bold");
    doc.text("Foto:", margemEsquerda + 5, posicaoY + 8); // Label
    // Adiciona a foto ao PDF se estiver disponível
    if (fotoDataUrl) {
        doc.addImage(fotoDataUrl, 'PNG', margemEsquerda + 5, posicaoY + 10, 80, 45); // Ajuste o tamanho da imagem conforme necessário
    } else {
        doc.text("Foto não carregada", margemEsquerda + 5, posicaoY + 35); // Placeholder para a foto
    }

    doc.rect(margemEsquerda + larguraFoto, posicaoY, larguraAvariado, alturaAvaEqui);
    doc.setFont("helvetica", "bold");
    doc.text("Avariado:", margemEsquerda + larguraFoto + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(avariado, margemEsquerda + larguraFoto + 30, posicaoY + 8);

    doc.rect(margemEsquerda + larguraFoto + larguraAvariado, posicaoY, larguraEquipNec, alturaAvaEqui);
    doc.setFont("helvetica", "bold");
    doc.text("Equip. Nec.:", margemEsquerda + larguraFoto + larguraAvariado + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(equiNec, margemEsquerda + larguraFoto + larguraAvariado + 30, posicaoY + 8);

    posicaoY += alturaAvaEqui;

    const larguraAlimEntrada = 45;
    const larguraAlimComunicacao = 45;
    const alturaAlimEntCom = 10;

    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    doc.rect(margemEsquerda + larguraFoto, posicaoY, larguraAlimEntrada, alturaAlimEntCom);
    doc.setFont("helvetica", "bold");
    doc.text("Alim. Entr.:", margemEsquerda + larguraFoto + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(alimEntrada, margemEsquerda + larguraFoto + 30, posicaoY + 8);

    doc.rect(margemEsquerda + larguraFoto + larguraAlimEntrada, posicaoY, larguraAlimComunicacao, alturaAlimEntCom);
    doc.setFont("helvetica", "bold");
    doc.text("Alim. Com.:", margemEsquerda + larguraFoto + larguraAlimEntrada + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(alimCom, margemEsquerda + larguraFoto + larguraAlimEntrada + 30, posicaoY + 8);

    posicaoY += alturaAlimEntCom;

    const larguraAlimOpe = 45;
    const larguraLimpeza = 45;
    const alturaAlimOpeLim = 10;

    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    doc.rect(margemEsquerda + larguraFoto, posicaoY, larguraAlimOpe, alturaAlimOpeLim);
    doc.setFont("helvetica", "bold");
    doc.text("Alim. Ope.:", margemEsquerda + larguraFoto + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(alimOpe, margemEsquerda + larguraFoto + 30, posicaoY + 8);

    doc.rect(margemEsquerda + larguraFoto + larguraAlimOpe, posicaoY, larguraLimpeza, alturaAlimOpeLim);
    doc.setFont("helvetica", "bold");
    doc.text("Limpeza:", margemEsquerda + larguraFoto + larguraAlimOpe + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(limpeza, margemEsquerda + larguraFoto + larguraAlimOpe + 30, posicaoY + 8);

    posicaoY += alturaAlimOpeLim;

    const larguraLedsSin = 45;
    const larguraReapBornes = 45;
    const alturaLedsBornes = 10;

    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    doc.rect(margemEsquerda + larguraFoto, posicaoY, larguraLedsSin, alturaLedsBornes);
    doc.setFont("helvetica", "bold");
    doc.text("Leds Sin.:", margemEsquerda + larguraFoto + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(ledsSin, margemEsquerda + larguraFoto + 30, posicaoY + 8);

    doc.rect(margemEsquerda + larguraFoto + larguraLedsSin, posicaoY, larguraReapBornes, alturaLedsBornes);
    doc.setFont("helvetica", "bold");
    doc.text("Reap. Bornes:", margemEsquerda + larguraFoto + larguraLedsSin + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(reapBornes, margemEsquerda + larguraFoto + larguraLedsSin + 35, posicaoY + 8);

    posicaoY += alturaLedsBornes;
    

    const larguraEquipAfetados = 90;
    const alturaEquipAfetados = 20;

    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    doc.rect(margemEsquerda + larguraFoto, posicaoY, larguraEquipAfetados, alturaEquipAfetados);
    doc.setFont("helvetica", "bold");
    doc.text("Equip. Afetados:", margemEsquerda + larguraFoto + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(equipAfetados, margemEsquerda + larguraFoto + 5, posicaoY + 14);

    posicaoY += alturaEquipAfetados;

    const larguraDesc = 180;
    const alturaDesc = 60;

    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    doc.rect(margemEsquerda, posicaoY, larguraDesc, alturaDesc);
    doc.setFont("helvetica", "bold");
    doc.text("Descrição:", margemEsquerda + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    const linhasDescricao = doc.splitTextToSize(descricao, larguraDesc - 10);

    let posYText = posicaoY + 14;

    linhasDescricao.forEach((linha) =>{
        doc.text(linha, margemEsquerda + 5, posYText);
        posYText += 6;
    });

    posicaoY += alturaDesc;

    const larguraSitOS = 90;
    const larguraDataProx = 90;
    const alturaSitDataProx = 10;
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    doc.rect(margemEsquerda, posicaoY, larguraSitOS, alturaSitDataProx);
    doc.setFont("helvetica", "bold");
    doc.text("Situação OS:", margemEsquerda + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(sitOS, margemEsquerda + 35, posicaoY + 8);

    doc.rect(margemEsquerda + larguraSitOS, posicaoY, larguraDataProx, alturaSitDataProx);
    doc.setFont("helvetica", "bold");
    doc.text("Próximo Atendimento:", margemEsquerda + larguraSitOS + 5, posicaoY + 8);
    doc.setFont("helvetica", "normal");
    doc.text(dataFormatada, margemEsquerda + larguraSitOS + 55, posicaoY + 8);

    posicaoY += alturaSitDataProx;


    // Salva o PDF
    doc.save('relatorio_diario.pdf');
}

// Função para carregar a imagem
function loadImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img.src);
        img.src = url;
    });
}