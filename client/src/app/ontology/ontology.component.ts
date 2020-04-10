import { Component, OnInit, ViewChild } from '@angular/core';
import { PolariteServiceService } from '../_services/polarite-service.service';
import { jqxTreeGridComponent } from 'jqwidgets-ng/jqxtreegrid';

@Component({
	selector: 'app-ontology',
	templateUrl: './ontology.component.html',
	styleUrls: ['./ontology.component.css']
})
export class OntologyComponent implements OnInit {

	@ViewChild('treeGridReference', {static: false}) treeGrid: jqxTreeGridComponent;

	private ontologyMemory: any = new Object();

	private word: string = "";
	private polarity: number = 0;

	constructor(private polariteService : PolariteServiceService) {}
	
	ngOnInit() {
	}

	updateData(data, value){
		switch(data){
			case "word":
				this.word = value;
			break;
			case "polarity":
				this.polarity = value;
			break;
		}
	}

	setPolarity() {

		this.polariteService.setOntologie(this.word,this.polarity).subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
		});

	}

	load() {
		this.polariteService.loadOntologie().subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
		});
	}

	reset() {
		this.polariteService.resetOntologie().subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
		});
	}

	dump() {
		this.polariteService.dumpOntologie().subscribe(data =>{
		});
	}

    private source: any =
    {
        dataType: "json",
        localData: this.ontologyMemory,
        dataFields: [
            { name: "id", type: "number" },
            { name: "part", type: "string" },
            { name: "synonyms", type: "string" },
            { name: "polarities", type: "number" },
            { name: "polaritymean", type: "number" },
            { name: "subparts", type: "array" }
        ],
        root: "root",
        id: "id",
        hierarchy:
        {
        	root: "subparts"
        }
    }

	public dataAdapter: any = new jqx.dataAdapter(this.source);

    public columns: any[] =
    [
        { text: "Parts", dataField: "part", width: 220 },
        { text: "Polarity mean", dataField: "polaritymean", width: 100,
            cellsRenderer: function (row, column, value, rowData) {
                if (value <0) { return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>'; }
                if (value >0) { return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>'; }
                return value;
            }
        },
        { text: "Polarity values", dataField: "polarities", width: 150 },
        { text: "Synonyms", dataField: "synonyms", width: 250 }
    ];

	public ready: any = () => {
		this.treeGrid.expandAll();
//		this.treeGrid.collapseAll();
	};
	
}
