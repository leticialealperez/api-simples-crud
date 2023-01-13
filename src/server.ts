import express, { Request, Response } from 'express';
import { v4 as uuid} from 'uuid';
import 'dotenv/config';
import cors from 'cors';
import { Contact, ResponseAPI } from './types';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
});

let contacts: Array<Contact> = [];

// GET - listar
app.get('/contacts', (request: Request, response: Response) => {
    
    const responseRoute: ResponseAPI = {
      success: true,
      message: 'Contatos buscados com sucesso!',
      data: contacts,
    };

    return response.status(200).send(responseRoute);
})


// POST - criar
app.post('/contacts', (request: Request, response: Response) => {
    const { name, phone } = request.body;

    if(!name || !phone) {
        const responseRoute: ResponseAPI = {
          success: false,
          message: 'As propriedade Nome e Telefone são obrigatórias',
          data: null,
        };

        return response.status(400).send(responseRoute);
    }
  

    const phoneParsed = phone.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9])/g, '');

    if (phoneParsed.length !== 11) {
      const resposta: ResponseAPI = {
        success: false,
        message:
          'O telefone é inválido. Por favor, informe o DDD e o telefone corretamente.',
        data: null,
      };

      return response.status(400).send(resposta);
    }

    if (contacts.some((contact) => contact.phone === phoneParsed)) {
      const resposta: ResponseAPI = {
        success: false,
        message:
          'Telefone já cadastrado em sua lista de contatos. Verifique!',
        data: null,
      };

      return response.status(400).send(resposta);
    }

    const newContact: Contact = {
      id: uuid(),
      name,
      phone: phoneParsed,
    };

    contacts.push(newContact);

    const resposta: ResponseAPI = {
      success: true,
      message: 'Contato cadastrado com sucesso!',
      data: newContact,
    };

    return response.status(201).send(resposta);
});


// PUT - atualizar
app.put('/contacts/:id', (request: Request, response: Response) => {
    const { id } = request.params;
    const { name, phone } = request.body;

    const indexFound = contacts.findIndex((contact) => contact.id === id)

    if (indexFound === -1) {
        const resposta: ResponseAPI = {
          success: false,
          message:
            'Contato não encontrado. Verifique o ID informado.',
          data: null,
        };

        return response.status(400).send(resposta);
    }


    if (phone) {
        const phoneParsed = phone
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9])/g, '');

        if (phoneParsed.length !== 11) {
            const resposta: ResponseAPI = {
            success: false,
            message:
                'O telefone é inválido. Por favor, informe o DDD e o telefone corretamente.',
            data: null,
            };

            return response.status(400).send(resposta);
        }

        if (contacts.some((contact) => contact.phone === phoneParsed)) {
          const resposta: ResponseAPI = {
            success: false,
            message:
              'Telefone já cadastrado em sua lista de contatos. Verifique!',
            data: null,
          };

          return response.status(400).send(resposta);
        }

        contacts[indexFound].phone = phoneParsed;
    }

    if(name) {
        contacts[indexFound].name = name;
    }


    const resposta: ResponseAPI = {
      success: true,
      message: 'Contato atualizado com sucesso!',
      data: contacts[indexFound],
    };

    return response.status(201).send(resposta);
});

// DELETE - deletar
app.delete('/contacts/:id', (request: Request, response: Response) => {
    const { id } = request.params;

    const indexFound = contacts.findIndex((contact) => contact.id === id)

    if (indexFound === -1) {
        const resposta: ResponseAPI = {
          success: false,
          message:
            'Contato não encontrado. Verifique o ID informado.',
          data: null,
        };

        return response.status(400).send(resposta);
    }


    contacts.splice(indexFound, 1)

    const resposta: ResponseAPI = {
      success: true,
      message: 'Contato deletado com sucesso!',
      data: contacts,
    };

    return response.status(201).send(resposta);
});


