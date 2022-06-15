class EmployeeSearch extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, " Employee Search Component ");
  }

}

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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
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

class EmployeeRow extends React.Component {
  render() {
    const employee = this.props.employee;
    const rowStyle = {
      border: "1px solid black",
      padding: 2
    };
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, employee.firstname), /*#__PURE__*/React.createElement("td", null, employee.lastname), /*#__PURE__*/React.createElement("td", null, employee.age), /*#__PURE__*/React.createElement("td", null, employee.dateofjoin), /*#__PURE__*/React.createElement("td", null, employee.title), /*#__PURE__*/React.createElement("td", null, employee.department), /*#__PURE__*/React.createElement("td", null, employee.employeetype), /*#__PURE__*/React.createElement("td", null, employee.curentstatus));
  }

}

class EmployeeTable extends React.Component {
  render() {
    const EmployeeRows = this.props.employees.map(employee => /*#__PURE__*/React.createElement(EmployeeRow, {
      key: employee.id,
      employee: employee
    }));
    return /*#__PURE__*/React.createElement("table", {
      className: "bordered-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "First Name"), /*#__PURE__*/React.createElement("th", null, "Last Name"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Date of Joining"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Department"), /*#__PURE__*/React.createElement("th", null, "Employee Type"), /*#__PURE__*/React.createElement("th", null, "Current Status"))), /*#__PURE__*/React.createElement("tbody", null, EmployeeRows));
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
      age: parseInt(form.age.value),
      dateofjoin: form.dateofjoin.value,
      title: form.title.value,
      department: form.department.value,
      employeetype: form.employeetype.value,
      curentstatus: 1
    };
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
    return /*#__PURE__*/React.createElement("form", {
      name: "employeeCreate",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "firstname",
      placeholder: "First Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "lastname",
      placeholder: "Last Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      name: "age",
      placeholder: "Age"
    }), /*#__PURE__*/React.createElement("input", {
      type: "date",
      name: "dateofjoin",
      placeholder: "Date of join"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "title",
      placeholder: "Title"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "department",
      placeholder: "Department"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "employeetype",
      placeholder: "employeetype"
    }), /*#__PURE__*/React.createElement("button", null, "Add"));
  }

}

class EmployeeDirectory extends React.Component {
  constructor() {
    super(); //when you have to call "this" in a constructor, you have to call super keyword

    this.state = {
      employees: []
    };
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    this.loadData();
  } //asynchronous function wait for setState to execute first


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

    async function EmployeeData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query
        })
      });
      return response.json();
    }

    const result = EmployeeData('/graphql', query).then(result => {
      console.log(result.data.employeeDirectory);
      this.setState({
        employees: result.data.employeeDirectory
      });
      return result.data.employeeDirectory;
    });
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
    const data = await graphQLFetch(query, {
      employee
    });

    if (data) {
      console.log(data);
      this.loadData();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(EmployeeSearch, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(EmployeeTable, {
      employees: this.state.employees
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(EmployeeCreate, {
      create: this.create
    }));
  }

}

const element = /*#__PURE__*/React.createElement(EmployeeDirectory, null);
ReactDOM.render(element, document.getElementById('root'));