import './App.css'
import DataTable from "react-data-table-component"
import { useState, useEffect } from "react"
import { ResponseData as response_data } from './constants'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      name: "Date",
      selector: (row) => {
        var date = new Date(row.date)
        var day = date.getDate().toString().padStart(2, '0');
        var month = date.getMonth().toString().padStart(2, '0');
        var year = date.getFullYear() - 2000
        return `${month}/${day}/${year}`
      },
    },
    {
      name: "Transaction",
      selector: (row) => row.type,
    },
    {
      name: "",
      selector: (row) => {
        var val = row.type
        val = (row.source && row.source.description) ? `${val} from ${row.source.description}` : val
        val = (row.requester && row.requester.type) ? `${val} for your ${row.requester.type}` : val
        val = (row.destination && row.destination.description) ? `${val} in ${row.destination.description}` : val
        return val
      },
      allowOverflow: true
    },
    {
      name: ""
    },
    {
      name: ""
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Balance",
      selector: (row) => row.balance - row.amount,
    }
  ]

  useEffect(() => {
    fetchTableData()
  }, [])

  async function fetchTableData() {
    setLoading(true)
    // below code is a sample code if we are fetching data from api
    // const URL = "www.example.com/transactions"
    // const response = await fetch(URL)

    // const response_data = await response.json()
  
    // removing duplicate entries
    var temp = []
    const filter_data = response_data.filter((item)=>{
      if(!temp.includes(item.activity_id)){
        temp.push(item.activity_id)
        return true;
      }
      return false;
    })

    // sorting data bases on date and amount for complex ledger json
    const sorted_data = filter_data.sort((a, b) => {
      return new Date(b.date) - new Date(a.date) || b.amt - a.amt; // descending
    })

    // set state data
    setData(sorted_data)
    setLoading(false)
  }


  return (
    <div style={{ margin: "20px" }}>
      <header className="App-header" >Investing Account</header>
      <div className="App-subheader">
        <header>${data[0]?.balance}</header>
        <header>Balance</header>
      </div>
      <DataTable
        title="Past Transactions"
        columns={columns}
        data={data}
        progressPending={loading}
      />
    </div>
  );
}

export default App;
