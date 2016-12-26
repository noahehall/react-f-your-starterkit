/*====================================================
	- HTML Table Filter Generator v1.0
	- By Max Guglielmi
	- mguglielmi.free.fr
  - http://www.javascriptsource.com/repository/javascripts/2006/05/835271/TableFilter_EN.htm
  - modified by @noahedwardhall
  - thank me later
=====================================================*/

let TblId = [];
let StartRow = [];
let SearchFlt = [];

/*====================================================
- adds a filter (input) for each column (td)
- adds button on last column
=====================================================*/
function AddRow (id,n) {
  let t = document.getElementById(id);
  let fltrow = t.insertRow(0);
  let inpclass = "flt";
  for(let i=0; i<n; i++){
    let fltcell = fltrow.insertCell(i);
    let inp = document.createElement("input");
    inp.setAttribute("id","flt"+i+"_"+id);
    inp.setAttribute("type","text");
    //inp.setAttribute("class","flt"); //doesn't seem to work on ie<=6
    fltcell.appendChild(inp);

    if(i==n-1) inpclass = "flt_s";
    document.getElementById("flt"+i+"_"+id).className = inpclass;
    document.getElementById("flt"+i+"_"+id).addEventListener(
      'keyup', Filter
    );
  }
}

/*====================================================
- returns text + text of child nodes of a cell
=====================================================*/
function getCellText (n) {
  let s = "";
  let enfants = n.childNodes;
  for(let i=0; i<enfants.length; i++)
  {
    let child = enfants[i];
    if(child.nodeType == 3) s+= child.data;
    else s+= getCellText(child);
  }
  return s.toLowerCase();
}

/*====================================================
- returns starting row for Filter fn for a
given table id
=====================================================*/
function getStartRow(id) {
  let r;
  for(let j in TblId) {
    if(TblId[j] === id) r = StartRow[j];
  }
  return r;
}


/*====================================================
- checks passed node is a ELEMENT_NODE nodeType=1
- removes TEXT_NODE nodeType=3
=====================================================*/
function getChildElms (n) {
  if(n.nodeType == 1){
    let enfants = n.childNodes;
    for(let i=0; i<enfants.length; i++)
    {
      let child = enfants[i];
      if(child.nodeType == 3) n.removeChild(child);
    }
    return n;
  }
}

/*====================================================
- filter (input) ids are stored in this.SearchFlt
array
=====================================================*/
function getFilters(id) {
  SearchFlt = [];
  let t = document.getElementById(id);
  let tr = t.getElementsByTagName("tr")[0];
  let inp = tr.getElementsByTagName("input");

  for(let i=0; i<inp.length; i++) SearchFlt.push(inp[i].getAttribute("id"));

  return SearchFlt;
}

/*====================================================
- returns number of cells in a row
- if nrow param is passed returns number of cells
of that specific row
=====================================================*/
function getCellsNb (id,nrow) {
    let t = document.getElementById(id);
  let tr;
  if(nrow == undefined) tr = t.getElementsByTagName("tr")[0];
  else  tr = t.getElementsByTagName("tr")[nrow];
  let n = getChildElms(tr);
  return n.childNodes.length;
}

const filterTable = {
  /*====================================================
  - Checks if id exists and is a table
  - Calls fn that adds inputs and button
  =====================================================*/
  setFilterGrid (id, ref_row) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

  	const tbl = document.getElementById(id);
  	if (tbl && tbl.nodeName.toLowerCase() === "table") {
  		TblId.push(id);
  		ref_row = ref_row === undefined ? StartRow.push(2) : StartRow.push(ref_row+2);
  		//let ncells = getCellsNb(id, ref_row);

  		// AddRow(id, ncells);
  	}
  },

  /*====================================================
  - gets search strings from this.SearchFlt array
  - retrieves data from each td in every single tr
  and compares to search string for current
  column
  - tr is hidden if all search strings are not
  found
  =====================================================*/
  Filter (e) {
    if (typeof document === 'undefined') return;
    const id = e.target.getAttribute("id").split("_")[1];
    let SearchFlt = getFilters(id);
    let t = document.getElementById(id);
    let SearchArgs = [];
    let ncells = getCellsNb(id);

    for(let i in SearchFlt) SearchArgs.push((document.getElementById(SearchFlt[i]).value).toLowerCase());

    let start_row = getStartRow(id);
    let row = t.getElementsByTagName("tr");

    for(let k=start_row; k<row.length; k++){
      /*** if table already filtered some rows are not visible ***/
      if(row[k].style.display === "none") row[k].style.display = "";

      let cell = getChildElms(row[k]).childNodes;
      let nchilds = cell.length;
      let isRowValid = true;

      if(nchilds === ncells){// checks if row has exact cell #
        let cell_value = [];
        let occurence = [];

        for(let j=0; j<nchilds; j++)// this loop retrieves cell data
        {
          let cell_data = getCellText(cell[j]);
          cell_value.push(cell_data);

          if(SearchArgs[j]!==""){
            occurence[j] = cell_data.split(SearchArgs[j]).length;
          }
        }//for j

        for(let t=0; t<ncells; t++) {
          if(SearchArgs[t]!=="" && occurence[t]<2) {
            isRowValid = false;
          }
        }//for t
      }//if

      if(isRowValid===false) row[k].style.display = "none";
      else row[k].style.display = "";
    }// for k
  },
}

export default filterTable;
