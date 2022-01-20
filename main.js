//Módulos Externos
import chalk from 'chalk'
import inquirer from 'inquirer'
//Módulos internos
import { Funcs } from './functions.js'

operation()

// Functions
export function operation() {
  const perguntaInicial = inquirer.prompt([
    {
      type: 'list',
      name: 'nomePerguntaInical',
      message: 'O que você deseja fazer?',
      choices: [
        'Criar conta',
        'Consultar saldo',
        'Depositar',
        'Sacar',
        'Verificar contas existentes',
        'Recuperar senha',
        'Sair'
      ]
    }
  ])

  perguntaInicial
    .then(resposta => {
      const escolha = resposta.nomePerguntaInical // Irá ter o valor da escolha

      if (escolha === 'Criar conta') {
        Funcs.createAccountMessage()
      } else if (escolha === 'Consultar saldo') {
        Funcs.getAccountBalance()
      } else if (escolha === 'Depositar') {
        Funcs.depositAmount()
      } else if (escolha === 'Sacar') {
        Funcs.withdrawAmount()
      } else if (escolha === 'Verificar contas existentes') {
        Funcs.checksExistingAccounts()
      } else if (escolha === 'Recuperar senha') {
        Funcs.forgotPassword()
      } else if (escolha === 'Sair') {
        console.log(chalk.bgCyan.black('Obrigado por usar o Brubank!'))
        process.exit()
      }
    })
    .catch(err => console.log(err))
}
