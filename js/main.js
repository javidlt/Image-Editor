 const width = 500;
const height = 500;

let input;
let uploadedimg = null;
let selectedcolorExist = false;

const downloadbtn = $('#download-button');
const selectedColor = $('#selected-color');


const redSlider = $('#red-slider');
const greenSlider = $('#green-slider');
const blueSlider = $('#blue-slider');
const brightnessSlider = $('#brightness-slider');
const toleranceSlider = $('#tolerance-slider');
const presetfilters = $('#preset-filters');
let sc_r = 0, sc_g = 0, sc_b = 0;


function setup() {
    createCanvas(width, height).parent('img_zone');
    pixelDensity(1)

    const htmlimgDrompZone = select('#dropimgzone');
    htmlimgDrompZone.dragOver(function() {
        htmlimgDrompZone.addClass('dragover');

    });
    htmlimgDrompZone.dragLeave(function() {
        htmlimgDrompZone.removeClass('dragover');
    });
    htmlimgDrompZone.drop(function(file) {
        uploadedimg = loadImage(file.data);
        htmlimgDrompZone.removeClass('dragover');
    })

    input = createFileInput(handleFile).parent('browseimgzone');
    input.position(10, 10);
    pixelDensity(1)

}

//upload images
function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    uploadedimg = loadImage(file.data, '');
    //uploadedimg.hide();
  } else {
    uploadedimg = null;
  }
}

function draw() {
    noFill();

    //centers the image
    if(uploadedimg){
        let imgzone_ratio = width/height;

        let imgwidth = uploadedimg.width;
        let imgheight = uploadedimg.height;
        let imgratio = imgwidth/imgheight;

        let x = 0, y = 0, w, h;

        if(imgratio > imgzone_ratio) {
            w = width;
            h = w/imgratio;
            y = (height - h)/2;
        } else {
            h = height;
            w = imgratio * h;
            x = (width - w)/2;
        }

        image(uploadedimg, x, y, w, h)
        
    } else {
        return
    }

    
    //filters

    loadPixels();

    if(selectedcolorExist && mouseInCanvas()){
        x = Math.round(mouseX);
        y = Math.round(mouseY);
        let index = (y * width + x) * 4;
        sc_r = pixels[index+0];
        sc_g = pixels[index+1];
        sc_b = pixels[index+2];
        selectedColor.css('background-color', `rgb(${sc_r}, ${sc_g}, ${sc_b})`);

    }

    if(presetfilters.val() === 'black-white'){
        blackandwhite(pixels);
    } else {
        if(presetfilters.val() === "greyscale") {
            greyscale(pixels);
        } else {
            if(presetfilters.val() === "sc") {
                singleColor(pixels);
            } else {
                defaultfilters(pixels);
            }
        }
       
    }

    
    
    updatePixels();
}
   
downloadbtn.click(function() { 
    uploadedimg.loadPixels();

    //pixel values
    let pixelBackup = [];
    for(let i = 0; i < uploadedimg.pixels.length; i++) {
        pixelBackup.push(uploadedimg.pixels[i]);
    }

    // applying filters and download

    if(presetfilters.val() === 'black-white'){
        blackandwhite(uploadedimg.pixels);
    } else {
        if(presetfilters.val() === "greyscale") {
            greyscale(uploadedimg.pixels);
        } else {
            if(presetfilters.val() === "sc") {
                singleColor(uploadedimg.pixels);
            } else {
                defaultfilters(uploadedimg.pixels);
            }
        }
       
    }

    // if(presetfilters.val() === 'black-white') {
    //     blackandwhite(uploadedimg.pixels);
    // } else {
    //     if(presetfilters.val() === "greyscale") { 
    //         greyscale(uploadedimg.pixels);
    //     } else {
    //         defaultfilters(uploadedimg.pixels);
    //     }
        
    // }
    
    uploadedimg.updatePixels();
    save(uploadedimg, `image_edited.png`);

    // restore img values
    uploadedimg.loadPixels();

    for(let i = 0; i < uploadedimg.pixels.length; i++) {
        uploadedimg.pixels[i] = pixelBackup[i];
    } 

    uploadedimg.updatePixels();
});

selectedColor.click(function() {
    selectedcolorExist = true;
})

function mouseClicked() {
    if(mouseInCanvas()) {
        selectedcolorExist = false;
    }
}


function mouseInCanvas() {
    if(mouseX >= 0 && mouseX <= width  && mouseY >= 0 && mouseY <= height){
        return true;
    } else {
        return false;
    }
}

// apply filters to the image

function singleColor(pixels) {
    const rslider = Number(redSlider.val());
    const gslider = Number(greenSlider.val());
    const bslider =  Number(blueSlider.val());
    const brslider = Number(brightnessSlider.val());
    for(let pixel = 0; pixel < pixels.length/4; pixel++) {
        let i = pixel * 4;

        let tolerance = Number(toleranceSlider.val());
        let difference =  Math.abs(pixels[i] - sc_r) + Math.abs(pixels[i+1] - sc_g) + Math.abs(pixels[i+2] - sc_b);

        if(difference < tolerance) {
            continue
        } else {
            let pixelavg =  (pixels[i] + pixels[i + 1] +pixels[i + 2])/3
            pixels[i] = pixelavg + rslider + brslider;
            pixels[i + 1] = pixelavg + gslider + brslider;
            pixels[i + 2] = pixelavg + bslider + brslider;
        }
        
    }
}

function greyscale (pixels) {
    const rslider = Number(redSlider.val());
    const gslider = Number(greenSlider.val());
    const bslider =  Number(blueSlider.val());
    const brslider = Number(brightnessSlider.val());
    for(let pixel = 0; pixel < pixels.length/4; pixel++) {
        let i = pixel * 4;
        let pixelavg =  (pixels[i] + pixels[i + 1] +pixels[i + 2])/3
        pixels[i] = pixelavg + rslider + brslider;
        pixels[i + 1] = pixelavg + gslider + brslider;
        pixels[i + 2] = pixelavg + bslider + brslider;
    }
}

function blackandwhite (pixels) {
    const rslider = Number(redSlider.val());
    const gslider = Number(greenSlider.val());
    const bslider =  Number(blueSlider.val());
    const brslider = Number(brightnessSlider.val());
    for(let pixel = 0; pixel < pixels.length/4; pixel++) { 
        let i = pixel * 4;
        let p = pixel * 4;
        let pixelaverage = (pixels[i] + pixels[i + 1] + pixels[i+2])/3;
        if(pixelaverage > 127.5){
            pixels[i] = 255 + rslider + brslider;
            pixels[i+1] = 255 + gslider + brslider;
            pixels[i+2] = 255 + bslider + brslider;
        } else {
            pixels[i] = 0 + rslider + brslider;
            pixels[i+1] = 0 + gslider + brslider;
            pixels[i+2] = 0 + bslider + brslider;
        }
    }
}

function defaultfilters(pixels) {
    const rslider = Number(redSlider.val());
    const gslider = Number(greenSlider.val());
    const bslider =  Number(blueSlider.val());
    const brslider = Number(brightnessSlider.val());
    for(let pixel = 0; pixel < pixels.length/4; pixel++) {
        let i = pixel * 4;
        pixels[i] = pixels[i] + rslider + brslider;
        pixels[i + 1] = pixels[i + 1] + gslider + brslider;
        pixels[i + 2] = pixels[i + 2] + bslider + brslider;
    }
}