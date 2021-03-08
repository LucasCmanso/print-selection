const btn_close = document.getElementById('btn_close');
const btn_print = document.getElementById('btn_print');
const btn_submit = document.getElementById('btn_submit');
const sidebar = document.querySelector('.sidebar');
const blocks = document.querySelectorAll('.blocks');
const checkboxes = document.querySelector('.checkBoxes');
const select_all = document.getElementById('select_all');
btn_submit.disabled = true;

createCheckboxes();

const checks = document.querySelectorAll('.checks');

//Begin - all lambdas

btn_close.addEventListener('click', () => {
    sidebar.classList.remove('active');
    blocks.forEach(b => {
        b.classList.remove('selection');
        b.style.pointerEvents = "none"
        b.style.cursor = "initial";
    });

    checks.forEach(c => c.checked = false);
    select_all.checked = false;
    btn_print.disabled = false;
    document.querySelector('.json').innerText = '';

});

btn_print.addEventListener('click', () => {
    btn_submit.disabled = true;
    blocks.forEach(b => {
        b.classList.toggle('selection');
        b.style.pointerEvents = "initial";
        b.style.cursor = "pointer";
    });
    sidebar.classList.add('active');
    btn_print.disabled = true;
    clickedBlocks();
});

btn_submit.addEventListener('click', () => {
    let json = {};
    let list = [];
    blocks.forEach(b => {
        if (!b.classList.contains('selection')) {
            list.push(b.innerText)
        }
    });

    json = {
        blocosImpressos: list,
        data: Date(),
        app: 'Acerta Positivo',
        cliente: '444.681.908-92'
    }

    document.querySelector('.json').innerText = JSON.stringify(json);

    const html = document.querySelector('.container');
    const htmlPrinting = html.cloneNode(true);
    const btn = htmlPrinting.querySelector('#btn_print');
    const newBlocks = htmlPrinting.querySelectorAll('.blocks');
    htmlPrinting.removeChild(btn);

    newBlocks.forEach(b => {
        if (b.classList.contains('selection')) {
            htmlPrinting.removeChild(b);
        }
    })

    const printingStyle = '<link rel="stylesheet" href="http://127.0.0.1:5500/style.css" type="text/css">';

    var htmlAtual = '<head>'
        .concat(printingStyle)
        .concat('<body>')
        .concat(htmlPrinting.innerHTML)
        .concat('</body>').concat('</html>');

    var printWindow = window.open('', 'Acerta Positivo');
    printWindow.document.write(htmlAtual);
    window.blur();
    printWindow.focus();
    setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 500);

});

select_all.addEventListener('change', () => {
    if (select_all.checked) {
        blocks.forEach(b => b.classList.remove('selection'));
        checks.forEach(c => c.checked = true);
    } else {
        blocks.forEach(b => b.classList.add('selection'));
        checks.forEach(c => c.checked = false);
    }

    checkbutton();
});

//End - all lambdas



function clickedBlocks() {
    blocks.forEach(b => {
        b.addEventListener('click', () => {
            const ck = Array.prototype.slice.call(checks);
            if (b.classList.contains('selection')) {
                let indexCk = ck.findIndex(c => c.value === b.innerText);
                checks[indexCk].checked = true;
                b.classList.remove('selection');
            } else {
                let indexCk = ck.findIndex(c => c.value === b.innerText);
                checks[indexCk].checked = false;
                b.classList.add('selection');
            }
            checkAllSelected();
            checkbutton();
        });


    });
}

function createCheckboxes() {
    let newCheck;
    let checkLabel;
    let checks = [];
    blocks.forEach((b, idx) => {
        checks.push({
            id: idx,
            name: b.innerText
        });
    });

    let i = 1;

    checks.forEach(c => {
        newCheck = document.createElement('input');
        newCheck.type = 'checkbox';
        newCheck.className = 'checks'
        newCheck.id = c.id;
        newCheck.value = c.name;
        newCheck.onchange = () => {
            checkboxSelected(event);
        }
        checkLabel = document.createElement('label');
        checkLabel.innerText = c.name;
        checkLabel.value = c.name;

        const br = document.createElement('br');

        checkboxes.appendChild(newCheck);
        checkboxes.appendChild(checkLabel);
        checkboxes.appendChild(br);
        i++;
    })
}

function checkboxSelected(obj) {
    const objID = +obj.srcElement.id;
    blocks.forEach((b, idx) => {
        if (objID === idx) {
            b.classList.toggle('selection');
            autoScroll(b);
        }
        checkAllSelected();
    });

    checkbutton();
}

function checkbutton() {
    const ck = Array.prototype.slice.call(checks);
    const imprime = ck.find(c => c.checked === true);
    if (imprime) {
        btn_submit.disabled = false;
    } else {
        btn_submit.disabled = true;
    }
}

function checkAllSelected() {
    let i = 0;
    blocks.forEach((b, idx) => {
        if (!b.classList.contains('selection')) i++;
        select_all.checked = blocks.length === i ? true : false;
    });
}

function autoScroll(b) {
    if (!b.classList.contains('selection')) {
        let target = b.getBoundingClientRect();
        const scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(target.x, target.y + (scroll - 110));
    }
}