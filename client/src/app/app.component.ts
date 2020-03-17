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
        url: "./assets/ontologieHotellerieV2.json",
        dataFields: [
            { name: "id", type: "number" },
            { name: "part", type: "string" },
            { name: "polarity", type: "number" },
            { name: "synonymes", type: "string" },
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
        { text: "polarity", dataField: "polarity", width: 100 },
        { text: "synonymes", dataField: "synonymes", width: 200 }
    ];

    ready: any = () => {
//            this.treeGrid.expandAll();
            this.treeGrid.collapseAll();
    };

}
