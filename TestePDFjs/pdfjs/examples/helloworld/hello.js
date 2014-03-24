/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

//
// See README for overview
//

'use strict';

//
// Fetch the PDF document from the URL using promises
//
var paginas = [];
var pageNum = 1;
var firstPage = 1;
var pageKey = "paginaAtual"

function increaseFont(){
    if(parseInt(document.getElementById("div"+window.pageNum).style.zoom) >= 160){
        console.log("parar zoomIn");
    } else{
        console.log('executando zoomIn...');
    	
        var zoomInValue = parseInt(document.getElementById("div"+window.pageNum).style.zoom) + 20 + '%';  
    	console.log("ZoomInValue: " + zoomInValue);                	
    	document.getElementById("div"+window.pageNum).style.zoom = zoomInValue;             
    }        
    return false;
}

function decreaseFont(){
    if(parseInt(document.getElementById("div"+window.pageNum).style.zoom) <= 60){
        console.log("parar zoomOut...");
    } else{
        console.log('executanto zoomOut...');    
        
        var zoomOutValue = parseInt(document.getElementById("div"+window.pageNum).style.zoom) - 20 + '%';        
        console.log("zoomOutValue: " + zoomOutValue);        
        document.getElementById("div"+window.pageNum).style.zoom = zoomOutValue;        
    }        
    return false;
}

function nextPage(){
    if(window.pageNum < window._pdf.numPages){
        escondePagina(window.pageNum);
        window.pageNum ++;
        mostraPagina(window.pageNum);        
        guardaPagina(pageKey, window.pageNum);
    }    
}

function previousPage(){
    
    if(window.pageNum > 1){
        escondePagina(window.pageNum);
        window.pageNum --;
        mostraPagina(window.pageNum);
        guardaPagina(pageKey, window.pageNum);
    }
}

function openPublicationOnFirstPage(){
    mostraPagina(firstPage);
}

function openPublicationOnCurrentPage(){
    mostraPagina(retornaPagina(pageKey));
}

function renderPdf(){
    PDFJS.getDocument('exemplo.pdf').then(function(pdf) {
        window._pdf = pdf;

        for(var x=1; x<pdf.numPages; x++){
            pdf.getPage(x).then(renderFunction);
        }    
    });
    
    mostraPagina(firstPage);
}

function renderFunction(page) {
    var scale = 1 ;
    var viewport = page.getViewport(scale);
    
    var divPrincipal = document.getElementById('divPrincipal');
    var canvas =  criaCanvas(divPrincipal, page.pageNumber );
    var context =  canvas.getContext('2d');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    var renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    
    page.render(renderContext);    
}


function criaCanvas(divPrincipal, id){
    var iDiv = document.createElement('div');
    iDiv.id = 'div' + id;
    iDiv.style.display = 'none';
    iDiv.style.zoom = '100%';
    
    var icanvas = document.createElement('canvas');
    icanvas.id = 'canvas' + id;
    
    iDiv.appendChild(icanvas);
    divPrincipal.appendChild(iDiv);
    
    return icanvas;
}

function escondePagina(num) {
    document.getElementById("div"+window.pageNum).style.display = "none";
}

function mostraPagina(num) {
    document.getElementById("div"+window.pageNum).style.display = "none";
    document.getElementById("div"+num).style.display = "block";
}

function guardaPagina(key, value){
    window.localStorage.setItem(key, value);    
}

function retornaPagina(key){
    var pageCurr = window.localStorage.getItem(key);    
    return pageCurr;
}

