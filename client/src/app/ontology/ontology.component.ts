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

	private part: string = "";
	private polarity: number = null;

	constructor(private polariteService : PolariteServiceService) {}
	
	ngOnInit() {
		this.load();
	}

	updateData(data, value){
		switch(data){
			case "part":
				this.part = value;
			break;
			case "polarity":
				this.polarity = value;
			break;
		}
	}

	setPolarity() {

		this.polariteService.setOntology(this.part,this.polarity).subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
		});

	}

	load() {
		this.polariteService.loadOntology().subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
		});
	}

	reset() {
		this.polariteService.resetOntology().subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
		});
	}

	dump() {
		this.polariteService.dumpOntology().subscribe(data =>{
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
            { name: "reviews", type: "number" },
            { name: "reviewmean", type: "number" },
            { name: "subparts", type: "array" },
            { name: "subpartmean", type: "number" },
            { name: "polarity", type: "number" }
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
        { text: "Parts", dataField: "part", width: 200 },
        { text: "Synonyms", dataField: "synonyms", width: 250 },
        { text: "Reviews", dataField: "reviews", width: 125 },
        { text: "Review mean", dataField: "reviewmean", width: 100,
            cellsRenderer: function (row, column, value, rowData) {
                if (value <0) { return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>'; }
                if (value >0) { return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>'; }
                return value;
            }
        },
        { text: "Subpart mean", dataField: "subpartmean", width: 125,
            cellsRenderer: function (row, column, value, rowData) {
                if (value <0) { return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>'; }
                if (value >0) { return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>'; }
                return value;
            }
        },
        { text: "Polarity", dataField: "polarity", width: 100,
			cellsRenderer: function (row, column, value, rowData) {
				if (value <0) { return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>'; }
				if (value >0) { return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>'; }
                return value;
			}
		}
];

	public ready: any = () => {
		this.treeGrid.expandAll();
//		this.treeGrid.collapseAll();
	};
	
}
