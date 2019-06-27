let doodle_input = '';

function refresh_doodle() {
    let doodle = document.getElementById('doodle');

    // get values from inputs
    let gridx = document.getElementById('gridx').value;
    let gridy = document.getElementById('gridy').value;

    let doodle_h = document.getElementById('doodle_h').value;
    let doodle_s = document.getElementById('doodle_s').value;
    let doodle_l = document.getElementById('doodle_l').value;
    let doodle_a = document.getElementById('doodle_a').value;
    let doodle_bg_color = `background-color: hsla(` + doodle_h + `, ` + doodle_s + `%, ` + doodle_l + `%, ` + doodle_a + `);`;



    // 
    // 
    // 


    // setting cell background color
    let cell_bg_h = document.getElementById('cell_h').value;
    let cell_bg_s = document.getElementById('cell_s').value;
    let cell_bg_l = document.getElementById('cell_l').value;
    let cell_bg_a = document.getElementById('cell_a').value;


    // This is where the @index is checked for and added
    let cell_bg_h_index_check = document.getElementById('cell_bg_h_index_check').checked;
    if (cell_bg_h_index_check === true) {
        // let temp = cell_bg_h
        cell_bg_h = 'calc(@i() * ' + cell_bg_h + ')';
    }

    // This is where @random is checked for and added
    let cell_bg_h_random_check = document.getElementById('cell_bg_h_random_check').checked;
    if (cell_bg_h_random_check === true) {
        let random_min = document.getElementById('cell_bg_h_random_min').value;
        let random_max = document.getElementById('cell_bg_h_random_max').value;

        // let temp = cell_bg_h
        cell_bg_h = 'calc(@r(' + random_min + ', ' + random_max + ') * ' + cell_bg_h + ')';
    }



    // setting the actual var
    let cell_bg_color = 'background-color: hsla(' + cell_bg_h + ', ' + cell_bg_s + '%, ' + cell_bg_l + '%, ' + cell_bg_a + ');';




    let cell_center = document.getElementById('cell_center').checked;
    if (cell_center === true) {
        cell_center = "@place-cell: center;"
    } else {
        cell_center = "";
    }






    // doodle border stuff
    let doodle_border_h = document.getElementById('doodle_border_h').value;
    let doodle_border_s = document.getElementById('doodle_border_s').value;
    let doodle_border_l = document.getElementById('doodle_border_l').value;
    let doodle_border_a = document.getElementById('doodle_border_a').value;

    // check for border radius
    let doodle_radius_check = document.getElementById('doodle_radius_check').checked;
    let doodle_border_radius = "";
    if (doodle_radius_check === true) {
        // setting border radius var
        let doodle_radius = document.getElementById('doodle_radius').value;
        doodle_border_radius = 'border-radius:' + doodle_radius + '%;';
    }

    let doodle_border_style = "";
    let doodle_border_width = "";
    let doodle_border_color = '';

    // check for border
    let doodle_border_check = document.getElementById('doodle_border_check').checked;

    if (doodle_border_check === true) {
        // setting border style var
        let e = document.getElementById("doodle_border_style");
        let style = e.options[e.selectedIndex].text;
        doodle_border_style = 'border-style:' + style + ';';

        // setting border width var
        let width = document.getElementById('doodle_border_width').value;
        doodle_border_width = 'border-width: ' + width + 'px;';

        // setting border color var
        doodle_border_color = `border-color: hsla(` + doodle_border_h + `, ` + doodle_border_s + `%, ` + doodle_border_l + `%, ` +
            doodle_border_a + `);`;
    }

    // end doodle border stuff


    // ============================


    // cell border stuff

    let cell_border_h = document.getElementById('cell_border_h').value;
    let cell_border_s = document.getElementById('cell_border_s').value;
    let cell_border_l = document.getElementById('cell_border_l').value;
    let cell_border_a = document.getElementById('cell_border_a').value;
    let cell_border_color = '';

    // if cell border radius
    let cell_radius_check = document.getElementById('cell_radius_check').checked;
    let cell_border_radius = "";
    if (cell_radius_check === true) {
        let cell_radius = document.getElementById('cell_radius').value;
        cell_border_radius = 'border-radius:' + cell_radius + '%;';
    }

    //if cell border 
    let cell_border_style = "";
    let cell_border_width = "";
    let cell_border_check = document.getElementById('cell_border_check').checked;
    if (cell_border_check === true) {

        // setting border color var
        cell_border_color = `border-color: hsla(` + cell_border_h + `, ` + cell_border_s + `%, ` + cell_border_l + `%, ` + cell_border_a + `);`;

        // setting border style var
        let e = document.getElementById("cell_border_style");
        cell_border_style = e.options[e.selectedIndex].text;
        cell_border_style = 'border-style:' + cell_border_style + ';';

        // setting border width var
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
            ` + doodle_bg_color + `
            ` + doodle_border_radius + `
            ` + doodle_border_style + `
            ` + doodle_border_width + `
            ` + doodle_border_color + `
            overflow:hidden;
        }
        --hue: calc( 100 + 1 * @row() * @col());
        ` + cell_bg_color + `
        ` + cell_center + `
        ` + cell_border_radius + `
        ` + cell_border_style + `
        ` + cell_border_width + `
        ` + cell_border_color + `



    `;
    // --hue: calc( 100 + 1 * @row() * @col());
    // background-color: hsla(var(--hue), 50%, 70%, @rand(0, 90%));

    console.log(doodle_input);

    doodle.update(doodle_input);
}

function print_me() {
    let div = document.getElementById('print_me');
    div.innerHTML = doodle_input;
}