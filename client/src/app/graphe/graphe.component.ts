import { Component, OnInit, Input } from '@angular/core';
import { PolariteServiceService } from '../_services/polarite-service.service';
import { Edge, Node } from '@swimlane/ngx-graph';
import * as d3 from 'd3';
import * as shape from 'd3-shape';




@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css']
})
export class GrapheComponent implements OnInit {

  @Input() private sentence : any;
  public words : any[] = new Array();
  public edges : any[] = new Array();
  private print : boolean = false;
  public nodes: Node[] = [];
  public links: Edge[] = [];
  curve = shape.curveLinear;
 

  constructor(private polarite : PolariteServiceService) { }

  ngOnInit() {
    this.print = false;
    

  }

  updateData(data, value){
    switch(data){
      case "sentence":
      this.sentence = value;
      
      //console.log(this.sentence);
    }
  }



  printgraph(){

    for(let i = 0 ; i<this.nodes.length;i++){
      console.log("node number "+i+" "+JSON.stringify(this.nodes[i]));
    }
    for(let i = 0 ; i<this.edges.length;i++){
      console.log("edge number "+i+" "+JSON.stringify(this.links[i]));
    }
    this.print=true;
  }

  getgraph(){
    console.log(this.sentence);
    this.polarite.requeteGraphe(this.sentence).subscribe(data =>{
      console.log("recu : " + JSON.stringify(data));

      this.words = data.graph.words;
      this.edges = data.graph.links; 
      this.nodes = new Array(this.words.length);
      this.links = new Array(this.edges.length);
      console.log("words : "+this.words+" taille : "+this.words.length);
      console.log("edges : "+this.edges+" taille : "+this.edges.length);
      
        
      for(let i=0;i<this.words.length;i++){
          let label: string = this.words[i].label;
          let idword: string = this.words[i].id;
          this.nodes[i] = {
            id: idword,
            label: label
          }
          
       /* 
          console.log("traitement du mot "+label+" d'id "+idword)
          for(let j = 0; j< this.edges.length;j++){


            console.log("l arete courante est : "+JSON.stringify(this.edges[j]));
            if(idword==this.edges[j].target){
              console.log("correspondance trouvee entre  "+this.edges[j].target+" et "+idword)
              this.edges[j].target = label;
            }
            else if(idword==this.edges[j].source){
              console.log("correspondance trouvee entre  "+this.edges[j].source+" et "+idword)
              this.edges[j].source = label;
            }
          }*/
      }

      for(let i=0;i<this.edges.length;i++){

        let idl : string = this.edges[i].id;
        let sl : string = this.edges[i].source;
        let tl : string = this.edges[i].target;
        let ll : string = this.edges[i].label;

        this.links[i] = {
          id: idl,
          source: sl,
          target: tl,
          label: ll
        }
      } 
    });
  }

}
