import chalk from 'chalk'
import fs from 'fs'
import inquirer from 'inquirer'
import { operation } from './main.js'

export class Funcs {
  //Mensagem ao selecionar 'Criar conta'
  static createAccountMessage() {
    console.log(chalk.bgGreen.black('Obrigado por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir:'))

    this.createAccount()
  }

  //Cria a conta
  static createAccount() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Digite um nome para a sua conta:'
        },
        {
          name: 'senha',
          message: 'Digite uma senha para a conta (somente números):'
        },
        {
          type: 'list',
          name: 'perguntaSenha',
          message: 'Escolha uma pergunta para a recuperação da senha:',
          choices: [
            'Qual seu ano de nascimento?',
            'Com qual idade começou a dirigir?',
            'Quantos anos sua mãe tinha em 2005?',
            'Quantos anos seu pai tinha em 2010?'
          ]
        },
        {
          name: 'palavraChave',
          message: 'Escreva a sua palavra chave:'
        }
      ])
      .then(resposta => {
        const nomeConta = resposta.accountName
        const senha = resposta.senha
        const perguntaSenha = resposta.perguntaSenha
        const palavraChave = resposta.palavraChave

        //Verifica se existe o diretório 'accounts' que armazenará as contas.
        if (!fs.existsSync('accounts')) {
          fs.mkdirSync('accounts')
        }

        //Verifica se o arquivo com o nome da conta escolhido já existe.
        //Se existir, imprime a mensagem e executa e função para escolher o nome novamente.
        if (fs.existsSync(`./accounts/${nomeConta}.json`)) {
          console.log(
            chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
          )
          this.createAccount()
          return
        }

        //Se o arquivo ainda não existe, cria ele.
        fs.writeFileSync(
          `./accounts/${nomeConta}.json`,
          `{"balance": 0, "senha": ${senha}, "perguntaSenha": "${perguntaSenha}", "palavraChave": ${palavraChave}}`,
          err => {
            if (err) {
              console.log(err)
              this.createAccount()
              return
            }
          }
        )
        console.log(chalk.green('A sua conta foi criada com sucesso!'))
        operation()
      })
      .catch(err => {
        console.log(err)
      })
  }

  //Deposita um valor na conta de um usuário
  static depositAmount() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Qual o nome sua conta?'
        }
      ])
      .then(resposta => {
        const accountName = resposta.accountName

        //Verifica se a conta existe
        if (!this.checksIfAccountExists(accountName)) {
          return this.depositAmount()
        }

        //Se exister peça e verifique a senha

        inquirer
          .prompt([
            {
              name: 'senha',
              message: 'Digite sua senha:'
            }
          ])
          .then(resposta => {
            const senha = resposta.senha
            const vericaSenha = this.verifiesIfPasswordIsCorrect(
              accountName,
              senha
            )
            if (!vericaSenha) {
              return this.depositAmount()
            } else {
              //Se a senha for correta pergunte o valor a ser depositado
              inquirer
                .prompt([
                  {
                    name: 'amount',
                    message: 'Quanto você deseja depositar?'
                  }
                ])
                .then(resposta => {
                  const amount = resposta.amount

                  this.addAmount(accountName, amount)
                })
                .catch(err => console.log(err))
            }
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  //Saca um valor da conta de um usuário
  static withdrawAmount() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Qual o nome sua conta?'
        }
      ])
      .then(resposta => {
        const accountName = resposta.accountName

        //Verifica se a conta existe
        if (!this.checksIfAccountExists(accountName)) {
          return this.withdrawAmount()
        }

        //Se exister peça e verifique a senha

        inquirer
          .prompt([
            {
              name: 'senha',
              message: 'Digite sua senha:'
            }
          ])
          .then(resposta => {
            const senha = resposta.senha
            const vericaSenha = this.verifiesIfPasswordIsCorrect(
              accountName,
              senha
            )
            if (!vericaSenha) {
              return this.withdrawAmount()
            } else {
              //Se a senha for correta pergunte o valor a ser depositado
              inquirer
                .prompt([
                  {
                    name: 'amount',
                    message: 'Quanto você deseja sacar?'
                  }
                ])
                .then(resposta => {
                  const amount = resposta.amount

                  this.deleteAmount(accountName, amount)
                })
                .catch(err => console.log(err))
            }
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  //Informa o saldo da conta
  static getAccountBalance() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Qual o nome sua conta?'
        }
      ])
      .then(resposta => {
        const accountName = resposta.accountName

        //Verifica se a conta existe
        if (!this.checksIfAccountExists(accountName)) {
          return this.getAccountBalance()
        }

        //Se existir peça e verifique a senha
        inquirer
          .prompt([
            {
              name: 'senha',
              message: 'Digite sua senha:'
            }
          ])
          .then(resposta => {
            const senha = resposta.senha
            const vericaSenha = this.verifiesIfPasswordIsCorrect(
              accountName,
              senha
            )
            if (!vericaSenha) {
              return this.getAccountBalance()
            } else {
              //Se a senha for correta mostra o saldo
              const account = this.getAccount(accountName)

              console.log(
                chalk.bgYellow.black(`Seu saldo é de R$${account.balance}!`)
              )
              operation()
            }
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  //Checa as contas existentes
  static checksExistingAccounts() {
    const accounts = fs.readdirSync('./accounts')

    accounts.forEach(conta => {
      console.log(conta.split('.')[0])
    })
  }

  //Recupera a senha
  static forgotPassword() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Qual o nome sua conta?'
        }
      ])
      .then(resposta => {
        const accountName = resposta.accountName

        //Verifica se a conta existe
        if (!this.checksIfAccountExists(accountName)) {
          return this.forgotPassword()
        }

        //Se existir faz a pergunta para recuperar a senha

        const account = this.getAccount(accountName)

        inquirer
          .prompt([
            {
              name: 'pergunta',
              message: account.perguntaSenha
            }
          ])
          .then(resposta => {
            if (resposta.pergunta != account.palavraChave) {
              console.log(chalk.bgRed.black('Palavra chave incorreta!'))
              operation()
              return
            } else {
              console.log('A sua senha é: ' + chalk.green(account.senha))
              operation()
            }
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  //Verifica se uma conta existe
  static checksIfAccountExists(accountName) {
    if (!fs.existsSync(`./accounts/${accountName}.json`)) {
      console.log(
        chalk.bgRed.black(
          'A conta não existe, por favor escolha uma existente!'
        )
      )
      return false
    } else {
      return true
    }
  }

  //Retorna os dados de uma conta
  static getAccount(accountName) {
    const accountJSON = JSON.parse(
      fs.readFileSync(`./accounts/${accountName}.json`, 'utf8')
    )

    return accountJSON
  }

  //Verifica se a senha está correta
  static verifiesIfPasswordIsCorrect(accountName, password) {
    const account = this.getAccount(accountName)

    if (account.senha != password) {
      console.log(chalk.bgRed.black('Senha incorreta!'))
      return false
    } else {
      return true
    }
  }

  //Adiciona um valor ao deposito da conta
  static addAmount(accountName, amount) {
    if (!amount) {
      console.log(chalk.bgRed.black('Insira um valor de depósito!'))
      return operation()
    }

    const account = this.getAccount(accountName)
    console.log('Valor depositado: ' + chalk.green(`R$${amount}`))
    console.log(`Saldo anterior: R$${account.balance}`)
    const novoSaldo = (account.balance =
      parseFloat(amount) + parseFloat(account.balance))
    console.log('Saldo atual: ' + chalk.green(`R$${novoSaldo}`))

    fs.writeFileSync(
      `./accounts/${accountName}.json`,
      JSON.stringify(account),
      err => {
        console.log(err)
      }
    )

    console.log(chalk.bgGreen.black('Deposito efetuado com sucesso!'))
    operation()
  }

  //Adiciona um valor ao saque da conta
  static deleteAmount(accountName, amount) {
    if (!amount) {
      console.log(chalk.bgRed.black('Insira um valor de depósito!'))
      return operation()
    }

    const account = this.getAccount(accountName)

    const parsedBalance = parseFloat(account.balance)
    const parsedAmount = parseFloat(amount)

    if (parsedBalance < parsedAmount) {
      console.log(chalk.bgRed.black('Valor de saque indisponível na conta!'))
      return operation()
    }

    console.log('Valor sacado: ' + chalk.red(`R$${amount}`))
    console.log(`Saldo anterior: R$${account.balance}`)

    const novoSaldo = (account.balance = parsedBalance - parsedAmount)
    console.log('Saldo atual: ' + chalk.green(`R$${novoSaldo}`))

    fs.writeFileSync(
      `./accounts/${accountName}.json`,
      JSON.stringify(account),
      err => {
        console.log(err)
      }
    )

    console.log(chalk.bgGreen.black('Saque efetuado com sucesso!'))
    operation()
  }
}
