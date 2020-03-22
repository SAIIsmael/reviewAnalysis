import { Component, ViewChild } from '@angular/core';
import { jqxTreeGridComponent } from 'jqwidgets-ng/jqxtreegrid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';

    @ViewChild('treeGridReference', {static: false}) treeGrid: jqxTreeGridComponent;

    source: any =
    {
        dataType: "json",
        url: "./assets/ontologieHotellerie.json",
        dataFields: [
            { name: "id", type: "number" },
            { name: "part", type: "string" },
            { name: "polarity", type: "number" },
            { name: "synonyms", type: "string" },
            { name: "subpart", type: "array" }
        ],
        root: "root",
        id: "id",
        hierarchy:
        {
        	root: "subpart"
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
    };

}
