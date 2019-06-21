let doodle_input = '';

function refresh_doodle() {
    let doodle = document.getElementById('doodle');

    // get values from inputs
    let gridx = document.getElementById('gridx').value;
    let gridy = document.getElementById('gridy').value;

    let doodle_h = document.getElementById('doodle_h').value;
    let doodle_s = document.getElementById('doodle_s').value;
    let doodle_l = document.getElementById('doodle_l').value;

    let cell_h = document.getElementById('cell_h').value;
    let cell_s = document.getElementById('cell_s').value;
    let cell_l = document.getElementById('cell_l').value;

    let cell_center = document.getElementById('cell_center').checked;
    if (cell_center === true) {
        cell_center = "@place-cell: center;"
    } else {
        cell_center = "";
    }


    // doodle border stuff

    let doodle_radius_check = document.getElementById('doodle_radius_check').checked;
    let doodle_border_radius = "";
    if (doodle_radius_check === true) {
        let doodle_radius = document.getElementById('doodle_radius').value;
        doodle_border_radius = 'border-radius:' + doodle_radius + '%;';
    }


    let doodle_border_style_check = document.getElementById('doodle_border_style_check').checked;
    let doodle_border_style = "";
    if (doodle_border_style_check === true) {
        let e = document.getElementById("doodle_border_style");
        doodle_border_style = e.options[e.selectedIndex].text;
        doodle_border_style = 'border-style:' + doodle_border_style + ';';
        console.log('worked');
    }


    let doodle_border_width_check = document.getElementById('doodle_border_width_check').checked;
    let doodle_border_width = "";
    if (doodle_border_width_check === true) {
        let width = document.getElementById('doodle_border_width').value;
        doodle_border_width = 'border-width: ' + width + 'px;';
    }

    // end doodle border stuff


    // ============================


    // cell border stuff

    let cell_radius_check = document.getElementById('cell_radius_check').checked;
    let cell_border_radius = "";
    if (cell_radius_check === true) {
        let cell_radius = document.getElementById('cell_radius').value;
        cell_border_radius = 'border-radius:' + cell_radius + '%;';
    }


    let cell_border_style = "";
    let cell_border_width = "";
    let cell_border_check = document.getElementById('cell_border_check').checked;
    if (cell_border_check === true) {

        let e = document.getElementById("cell_border_style");
        cell_border_style = e.options[e.selectedIndex].text;
        cell_border_style = 'border-style:' + cell_border_style + ';';
        console.log('worked');

        let width = document.getElementById('cell_border_width').value;
        cell_border_width = 'border-width: ' + width + 'px;';

        // This is where the @index is checked for and added
        let cell_border_index_check = document.getElementById('cell_border_index_check').checked;
        if (cell_border_index_check === true) {
            cell_border_width = 'border-width: calc(@i() * ' + width + 'px);'
        }

    }


    // end cell border stuff

    // ==================




    doodle_input = `
        :doodle{
            @grid: ` + gridx + `x` + gridy + `;
            @size: 50vmax;
            background-color: hsl(` + doodle_h + `, ` + doodle_s + `%, ` + doodle_l + `%);
            ` + doodle_border_radius + `
            ` + doodle_border_style + `
            ` + doodle_border_width + `
            border-color: red;
            overflow:hidden;
        }
        --hue: calc( 100 + 1 * @row() * @col());
        ` + cell_center + `
        ` + cell_border_radius + `
        ` + cell_border_style + `
        ` + cell_border_width + `


        background-color: hsla(var(--hue), 50%, 70%, @rand(0, 90%));

    `;


    console.log(doodle_input);

    doodle.update(doodle_input);
}

function print_me() {
    let div = document.getElementById('print_me');
    div.innerHTML = doodle_input;
}

