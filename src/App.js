import React, { useState } from 'react';
import { Button, Nav, Navbar, Container, Table } from 'react-bootstrap';
import Select from 'react-select'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'




class App extends React.Component {

  constructor() {
    super();
    
 		 this.state={
        items:[],
        isLoading: false,
        isLoaded: false,
        visibility: "hidden",
        languages: []
      };

      this.search = this.search.bind(this);

  }

  search(e){

    if(this.state.languages.length != 0){
      this.setState({
        isLoading: true,
        items: [],
        isLoaded: false
      })
      

      let key;
      for(let i = 0; i < this.state.languages.length; i++){
        
        fetch(`https://api.github.com/search/repositories?q=+language:${this.state.languages[i]}&sort=stars&order=desc`)
        .then((response)=> {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            alert("Erro na request: " + response.statusText);
          }
        })
        .then(
          (result) => {
            this.setState({
              isLoading: false,
              items: this.state.items != [] ? this.state.items.concat(result.items) : result.items,
              visibility: "show"
            });
            console.log(this.state.languages[i])

            if(i == this.state.languages.length-1){
              this.setState({
                isLoaded: true
              })
            }

          }
        ).catch(function(error){
          console.log(error)
        })
      }


        
    }

  }

  render() {

    {/* Opções de linguagens para buscar no GitHub */} 
    const options = [
      { value: 'go', label: 'Go' },
      { value: 'swift', label: 'Swift' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'rust', label: 'Rust' },
      { value: 'kotlin', label: 'Kotlin' },
      { value: 'python', label: 'Python' },
      { value: 'c', label: 'C' },
      { value: 'julia', label: 'Julia' },
      { value: 'coffescript', label: 'CoffeScript' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'haskell', label: 'Haskel' }
    ]
    
    const separatorStyle = {
      height: '10px'
    }

 
// handle onChange event of the dropdown
const handleChange = (e) => {
  this.setState({
    
    languages: Array.isArray(e) ? e.map(x => x.value) : []
    
  });
}
    
    
    
    return (
      
      <div className="App">
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={process.env.PUBLIC_URL + '/0.png'} 
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              DevChallenge Ateliware
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Desenvolvido por: <a href="#login">Emerson Costin</a>
              </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    
        <img src={process.env.PUBLIC_URL + '/github-mark.png'} className="App-logo" alt="logo" />
        <p>
          Selecione as linguagens desejadas e clique em <code>Buscar</code>.
        </p>

        <Container>

          {/* Componente  */}
          <Select
            placeholder="Linguagens"
            options={options}
            isMulti
            name="languages" 
            onChange={handleChange}
          />

          <div style={separatorStyle}></div>

          <Button variant="secondary" size="lg" block onClick={(e) => this.search(e)}>
            Buscar
          </Button>

          <div style={separatorStyle}></div>

        </Container>

        <Container>
        <Table striped bordered hover>
          {/* Alterar o state visibility quando finalizar de carregar os dados da busca */}
          <thead className={this.state.visibility}>
              <tr>
                <th>Linguagem</th>
                <th>Nome do Repositório</th>
                <th>Total de Estrelas</th>
                <th>Detalhes</th>
              </tr>
          </thead> 
          <tbody>
          {
          /* Se o state isLoading for true e o isLoaded for false mostra a informação de 'carregando' */
          this.state.isLoading == true && this.state.isLoaded == false ?
            <tr><td colspan="4"><center><h2>Carregando...</h2></center></td></tr>
          : this.state.isLoaded == true &&
          /* Se o state de isLoaded for true renderiza a tabela */
            this.state.items.map(item=><tr key={item.id}>
                <td>{item.language}</td>
                <td>{item.full_name}</td>
                <td>{item.stargazers_count}</td>
                <td><a href={item.html_url} target="_blank">Mais...</a></td>
              </tr>) 
            
          }
          </tbody>
        </Table>
        </Container>
        
      </div>

    );
  }
}

export default App;
