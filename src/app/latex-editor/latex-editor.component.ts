import { Component, AfterViewInit, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    MathJax: any;
    typesetInput: (button: HTMLButtonElement) => void;
  }
}

// Declare MathJax as a global variable
declare var MathJax: any;

@Component({
  selector: 'app-latex-editor',
  standalone: true,
  imports: [],
  templateUrl: './latex-editor.component.html',
  styleUrls: ['./latex-editor.component.css']
})
export class LatexEditorComponent implements OnInit, AfterViewInit {

  latexContent: string = '';
  input : any;
  toastr: any;
  ngOnInit(): void {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
    const storedLatexContent = localStorage.getItem('latexContent');
    if (storedLatexContent) {
      this.latexContent = JSON.parse(storedLatexContent);
      // Set the value of the textarea
      this.input = document.getElementById('MathInput') as HTMLTextAreaElement;
      if (this.input) {
        this.input.value = this.latexContent; // Set the value in the textarea
      }
    }
  }

  ngOnDestroy() {
    localStorage.setItem('latexContent', JSON.stringify(this.latexContent));
  }

  ngAfterViewInit() {
    this.initializeMathJax();
  }

  initializeMathJax() {
    window.MathJax = {
      loader: { load: ['input/asciimath'] },
      startup: {
        pageReady: () => {
           this.input = document.getElementById('MathInput') as HTMLTextAreaElement;
           const output = document.getElementById('MathPreview');

          if (this.input && output) {
            window.typesetInput = (button: HTMLButtonElement) => {
              button.disabled = true;
              output.innerHTML = this.input.value.trim();

              MathJax.texReset();
              MathJax.typesetClear();
              MathJax.typesetPromise([output]).catch(function (err: { message: string; }) {
                output.innerHTML = '';
                output.appendChild(document.createTextNode(err.message));
               // console.error(err);
              }).then(function () {
                button.disabled = false;
              });
            };
          }

          return MathJax.startup.defaultPageReady();
        }
      },
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        processEscapes: true
      }
    };
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.latexContent = input.value;
  }

  checkQuestion(event: Event): void {
    const button = event.target as HTMLButtonElement;
    if (window.typesetInput) {
      window.typesetInput(button);
    }
  }

  copyText() {
    const inputElement = document.getElementById('MathInput') as HTMLTextAreaElement;
    if (inputElement) {
      inputElement.select(); // Select the text inside the textarea
      document.execCommand('copy'); // Copy the selected text to the clipboard
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Text Copied',
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  
}
