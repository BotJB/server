
//This component made 
class EmployeeSearch extends React.Component {
    render() {            
        return (
            <div> Employee Search Component </div>
        )
    }
}
//This component made
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}
async function graphQLFetch(query, variables = {}) {
    console.log(query, variables);
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query, variables })
        });
        
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);
        if (result.errors) {
            const error = result.errors[0];
            if (error.extensions.code == 'BAD_USER_INPUT') {
                const details = error.extensions.exception.errors.join('\n ');
                alert(`${error.message}:\n ${details}`);
            } else {
                alert(`${error.extensions.code}: ${error.message}`);
            }
        }
        return result.data;
    } catch (e) {
        alert(`Error in sending data to server: ${e.message}`);
    }
}
//done in components
class EmployeeRow extends React.Component {
    render() {    
        const employee=this.props.employee;
        const rowStyle = {border: "1px solid black", padding: 2};
        return(
    <tr>
        <td>{employee.firstname}</td>
        <td>{employee.lastname}</td>
        <td>{employee.age}</td>
        <td>{employee.dateofjoin}</td>
        <td>{employee.title}</td>
        <td>{employee.department}</td>
        <td>{employee.employeetype}</td>
        <td>{employee.curentstatus}</td>
    </tr>
        )        }
}

class EmployeeTable extends React.Component {
    render() {    
          
            
        const EmployeeRows = this.props.employees.map(employee => <EmployeeRow key={employee.id} employee={employee}/>)
        
        return (
            <table className="bordered-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Age</th>
                        <th>Date of Joining</th>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Employee Type</th>
                        <th>Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    {EmployeeRows}
                    {}
                </tbody>
            </table>
        )
    }
}
class EmployeeCreate extends React.Component {

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
       
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.employeeCreate;
        const employee = {
            firstname: form.firstname.value,
            lastname: form.lastname.value,
            age:parseInt(form.age.value),
            dateofjoin:form.dateofjoin.value,
            title:form.title.value,
            department:form.department.value,
            employeetype:form.employeetype.value,
            curentstatus:1,
            
        }
        this.props.create(employee);
        form.firstname.value = "";
        form.lastname.value = "";
        form.age.value = "";
        form.dateofjoin.value = "";
        form.title.value = "";
        form.department.value = "";
        form.employeetype.value = "";   
    }

    render() {            
        return (
            <form name="employeeCreate" onSubmit={this.handleSubmit}>
                <input type="text" name="firstname" placeholder="First Name" />
                <input type="text" name="lastname" placeholder="Last Name" />
                <input type="number" name="age" placeholder="Age" />
                <input type="date" name="dateofjoin" placeholder="Date of join" />
                <input type="text" name="title" placeholder="Title" />
                <input type="text" name="department" placeholder="Department" />
                <input type="text" name="employeetype" placeholder="employeetype" />
                <button>Add</button>
            </form>
        )
    }
}


class EmployeeDirectory extends React.Component {
    constructor() {
        super(); //when you have to call "this" in a constructor, you have to call super keyword
        this.state = {employees: []};
        this.create = this.create.bind(this);
        
    }
    componentDidMount() {
        this.loadData();
    }

    //asynchronous function wait for setState to execute first
    loadData() {
       
        const query = `query {
         employeeDirectory {
             firstname
             lastname
             age
             dateofjoin
             title
             department
             employeetype
             curentstatus
         }
       }`;
       async function EmployeeData(url='', data={}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
        });
        return response.json();
        }

        const result = EmployeeData('/graphql', query)
            .then(result =>{                    
                console.log(result.data);
                this.setState({ employees: result.data.employeeDirectory });
                return result.data.employeeDirectory;                   
        })
    }

    async create(employee) {
       
        const query = `
        mutation employeeCreate($employee: EmployeeInputs!) {
                employeeCreate(employee: $employee) {
                    firstname
                    lastname
                    age
                    dateofjoin
                    title
                    department
                    employeetype
                    curentstatus
                } 
        }`;
        const data = await graphQLFetch(query ,{employee});
        if (data)
        {
            console.log(data)
        this.loadData();
        }
    }
    render() {
        return (
            <div>
                <EmployeeSearch/>
                <hr/>
                <EmployeeTable employees={this.state.employees}/>
                <hr/>
                <EmployeeCreate create={this.create}/>
            </div>
        )
    }
}

const element = <EmployeeDirectory/>
ReactDOM.render(element, document.getElementById('root'));

