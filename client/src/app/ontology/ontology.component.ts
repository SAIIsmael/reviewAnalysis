import { Component, OnInit, ViewChild } from '@angular/core';
import { jqxTreeGridComponent } from 'jqwidgets-ng/jqxtreegrid';
import * as ontologyMemory from '../../assets/ontologieHotellerie.json';

@Component({
  selector: 'app-ontology',
  templateUrl: './ontology.component.html',
  styleUrls: ['./ontology.component.css']
})
export class OntologyComponent implements OnInit {

	constructor() {}

	ngOnInit() {
	}

    @ViewChild('treeGridReference', {static: false}) treeGrid: jqxTreeGridComponent;

    source: any =
    {
        dataType: "json",
        localData: ontologyMemory,
//      url: "./assets/ontologieHotellerie.json",
        dataFields: [
            { name: "id", type: "number" },
            { name: "part", type: "string" },
            { name: "synonyms", type: "string" },
            { name: "polarity", type: "number" },
            { name: "subparts", type: "array" }
        ],
        root: "root",
        id: "id",
        hierarchy:
        {
        	root: "subparts"
        }
    }

    dataAdapter: any = new jqx.dataAdapter(this.source);

    columns: any[] =
    [
        { text: "part", dataField: "part", minWidth: 200, width: 200 },
        { text: "polarity", dataField: "polarity", width: 100,

            cellsRenderer: function (row, column, value, rowData) {
                if (value <0) {
                    return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>';
                }
                if (value >0) {
                    return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>';
                }
                return value;
            }

        },
        { text: "synonyms", dataField: "synonyms", width: 200 }
    ];

    ready: any = () => {
//            this.treeGrid.expandAll();
            this.treeGrid.collapseAll();
            this.setPolarity("dortoir",12);
            this.setPolarity("WC",-5);
    };

	private find(obj,part,polarity) {
		var trace=false;
		var find=false;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var val = obj[key];
				if(trace) console.log("key="+key);
				if(trace) console.log("val="+val);
				if(key=="part") {
					if(val==part) {
						console.log("FIND part: "+part+" !!!");
						find=true;
					}
				}
				if(key=="synonyms") {
					if(!find) {
						for (var i=0; i<val.length; i++) {
							if(trace) console.log("synonym="+val[i]);
							if(val[i]==part) {
								console.log("FIND synonym: "+part+" !!!");
								find=true;
							}
						}
					}
				}
				if(key=="polarity") {
					if(find) {
						console.log("SET polarity: "+polarity+" !!!");
						obj[key]=polarity;
						this.treeGrid.updateBoundData();
					}
				}
				if(key=="subparts") {
					if(!find) {
						for (var j=0; j<val.length; j++) {
							if(trace) console.log("subpart="+val[j]);
							this.find(val[j],part,polarity);
						}
					}
				}
			}
		}
	}

	setPolarity(part,polarity) {
		this.find(ontologyMemory.root[0],part,polarity);
	}

}
