
function refresh_doodle() {
    let doodle = document.getElementById('doodle');

    // get values from inputs
    let gridx = document.getElementById('gridx').value;
    let gridy = document.getElementById('gridy').value;
    let doodle_h = document.getElementById('doodle_h').value;
    let doodle_s = document.getElementById('doodle_s').value;
    let doodle_l = document.getElementById('doodle_l').value;




    doodle.update(`
        :doodle{
            @grid: `+ gridx +`x`+ gridy +`;
            @size: 50vmax;
            background-color: hsl(`+ doodle_h +`, `+ doodle_s +`%, `+ doodle_l +`%);
        }
        --hue: calc( 100 + 1 * @row() * @col());

        background-color: hsla(var(--hue), 50%, 70%, @rand(0, 90%));

    `);
}