"use client";

import "./CadastroVacinaForm.css";
import Layout from "@/components/Layout/Layout";
import Button from "@/components/UI/Button/Button";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState
} from "react";
import { apiUrl } from "@/lib/api";
import type { Vacina } from "@/types/vacina";
import { Suspense } from "react";


const vacinaSchema = Yup.object({
  nomeVacina: Yup.string()
    .required("Informe o nome da vacina"),

  tipoVacina: Yup.string()
    .required("Informe o tipo da vacina"),

  especie: Yup.string()
    .required("Informe a espécie"),

  fabricante: Yup.string()
    .required("Informe o fabricante"),

  descricao: Yup.string(),

  numeroLote: Yup.string().
    required("Informe o número do lote"),

  dataFabricacao: Yup.date()
    .required("Informe a data de fabricação"),

  dataValidade: Yup.date()
    .required("Informe a data de validade"),

  quantidadeRecebida: Yup.number()
    .required("Informe a quantidade recebida")
    .integer("Informe uma quantidade inteira")
    .positive("Quantidade deve ser positiva"),

  dataEntrada: Yup.date()
    .required("Informe a data de entrada"),

  responsavel: Yup.string()
    .required("Informe o responsável"),

  fornecedor: Yup.string()
    .required("Informe o fornecedor"),

  notaFiscal: Yup.string()
    .required("Informe a nota fiscal"),

  valorUnitario: Yup.number()
    .required("Informe o valor unitário")
    .min(0, "O valor deve ser maior ou igual a zero"),

  valorTotal: Yup.number()
    .required("Informe o valor total")
    .min(0, "O valor deve ser maior ou igual a zero"),

  temperatura: Yup
    .string(),

  localArmazenamento: Yup.string(),

  refrigeracao: Yup.boolean(),

})

function CadastroVacinaFormulario() {



  const router = useRouter();

  const [dadosIniciais, setDadosIniciais] = useState({
    nomeVacina: "",
    tipoVacina: "",
    especie: "",
    fabricante: "",
    descricao: "",
    numeroLote: "",
    dataFabricacao: "",
    dataValidade: "",
    quantidadeRecebida: "",
    dataEntrada: "",
    responsavel: "",
    fornecedor: "",
    notaFiscal: "",
    valorUnitario: "",
    valorTotal: "",
    temperatura: "",
    localArmazenamento: "",
    refrigeracao: false,
  });

  const searchParams = useSearchParams();

  const vacinaId = searchParams.get("id");

  const modoEdicao = vacinaId !== null;


  //==========================================================


  useEffect(() => {

    if (!modoEdicao) {
      return;
    }

    async function carregarVacina() {

      try {

        const response = await fetch(`${apiUrl}/vacinas/${vacinaId}`);
        if (!response.ok) {
          throw new Error("Não foi possível carregar a vacina.");
        }
        const vacina: Vacina = await response.json();

        setDadosIniciais({
          nomeVacina: vacina.nome || "",
          tipoVacina: vacina.tipo || "",
          especie: vacina.especie || "",
          fabricante: vacina.fabricante || "",
          descricao: vacina.descricao || "",
          numeroLote: vacina.lote || "",
          dataFabricacao:
            vacina.dataFabricacao || "",
          dataValidade:
            vacina.validade || "",
          quantidadeRecebida:
            String(vacina.quantidade),
          dataEntrada:
            vacina.dataEntrada || "",
          responsavel:
            vacina.responsavel || "",
          fornecedor:
            vacina.fornecedor || "",
          notaFiscal:
            vacina.notaFiscal || "",
          valorUnitario:
            String(vacina.valorUnitario),
          valorTotal:
            String(vacina.valorTotal),
          temperatura:
            vacina.temperatura || "",
          localArmazenamento:
            vacina.localArmazenamento || "",
          refrigeracao:
            Boolean(vacina.refrigeracao),
        });

      } catch (error) {

        console.error(error);

      }

    }

    carregarVacina();

  }, [modoEdicao, vacinaId]);



  return (

    <Layout>
      <section className="vacina-container">

        {/* HEADER */}

        <div className="vacina-header">

          <h1>
            {modoEdicao
              ? "Editar Vacina"
              : "Cadastro de Vacinas"}
          </h1>

          <p>
            Gerencie vacinas, lotes, estoque e
            controle de armazenamento.
          </p>

        </div>

        <Formik
          initialValues={
            dadosIniciais
          }
          enableReinitialize
          validationSchema={vacinaSchema}
          onSubmit={
            async (values, { resetForm }) => {
              try {

             

                const body = {
                  nome: values.nomeVacina,
                  tipo: values.tipoVacina,
                  especie: values.especie,
                  fabricante: values.fabricante,
                  descricao: values.descricao,
                  lote: values.numeroLote,
                  dataFabricacao: values.dataFabricacao,
                  validade: values.dataValidade,
                  quantidade: Number(values.quantidadeRecebida),
                  dataEntrada:values.dataEntrada,
                  responsavel:values.responsavel,
                  fornecedor:values.fornecedor,
                  notaFiscal:values.notaFiscal,
                  valorUnitario: Number(values.valorUnitario),
                  valorTotal: Number(values.valorTotal),
                  temperatura:values.temperatura,
                  localArmazenamento: values.localArmazenamento,
                  refrigeracao: values.refrigeracao
                };

                const caminho = modoEdicao
                  ? `${apiUrl}/vacinas/${vacinaId}`
                  : `${apiUrl}/vacinas`;

                const response = await fetch(caminho, {
                  method: modoEdicao ? "PUT" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                });

                const resultado = await response.json();
                if (!response.ok) {
                  throw new Error(resultado.mensagem || "Erro ao salvar vacina.");
                }

                alert(
                  modoEdicao
                    ? "Vacina atualizada com sucesso!"
                    : "Vacina cadastrada com sucesso!"
                );

                if (modoEdicao) {
                  router.push(
                    "/lista-vacinas"
                  );

                } else {

                  resetForm();

                }

              } catch (error) {
                console.error(error);
                alert(error instanceof Error ? error.message : "Erro ao salvar vacina.");
              }

            }}
        >

          {() => (

            <Form className="vacina-form">

              {/* INFORMAÇÕES DA VACINA */}

              <div className="form-card">
                <h2>
                  Informações da Vacina
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome da Vacina</label>
                    <Field
                      name="nomeVacina"
                      type="text"
                    />

                    <ErrorMessage
                      name="nomeVacina"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tipo</label>
                    <Field
                      as="select"
                      name="tipoVacina">
                      <option value="">
                        Selecione
                      </option>

                      <option value="V8">
                        V8
                      </option>

                      <option value="V10">
                        V10
                      </option>

                      <option value="Antirrábica">
                        Antirrábica
                      </option>

                      <option value="V4">
                        V4
                      </option>
                      <option value="V3">
                        V3
                      </option>
                      <option value="V5">
                        V5
                      </option>
                      <option value="Giárdia">
                        Giárdia
                      </option>
                    </Field>

                    <ErrorMessage
                      name="tipoVacina"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Espécie</label>
                    <Field
                      as="select"
                      name="especie">
                      <option value="">
                        Selecione
                      </option>

                      <option value="cao">
                        Cão
                      </option>

                      <option value="gato">
                        Gato
                      </option>

                      <option value="ambos">
                        Ambos
                      </option>
                    </Field>
                    <ErrorMessage
                      name="especie"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Fabricante</label>

                    <Field
                      name="fabricante"
                      type="text" />
                    <ErrorMessage
                      name="fabricante"
                      component="span"
                      className="error-message" />
                  </div>

                </div>

                <div className="form-group full-width">

                  <label>
                    Descrição
                  </label>

                  <Field
                    as="textarea"
                    name="descricao"
                  />

                </div>

              </div>

              {/*=========================CONTROLE DE LOTE======================== */}

              <div className="form-card">
                <h2>Controle de Lote</h2>

                <div className="form-grid">
                  {/* CAMPO LOTE DE FABRICANTE */}
                  <div className="form-group">
                    <label> Número do Lote  </label>

                    <Field
                      name="numeroLote"
                      type="text"
                    />
                    <ErrorMessage
                      name="numeroLote"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* DATA FABRICANTE */}
                  <div className="form-group">
                    <label>Data de Fabricação</label>

                    <Field
                      name="dataFabricacao"
                      type="date"
                    />
                    <ErrorMessage
                      name="dataFabricacao"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* DATA DE VALIDADE */}
                  <div className="form-group">
                    <label>Data de Validade</label>

                    <Field
                      name="dataValidade"
                      type="date"
                    />
                    <ErrorMessage
                      name="dataValidade"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* QUANTIDADE RECEBIDA */}
                  <div className="form-group">
                    <label>Quantidade Recebida</label>

                    <Field
                      name="quantidadeRecebida"
                      type="number"
                    />
                    <ErrorMessage
                      name="quantidadeRecebida"
                      component="span"
                      className="error-message"
                    />
                  </div>

                </div>

              </div>

              {/* ================================================================ */}

              {/*========================ENTRADA NO ESTOQUE======================= */}

              <div className="form-card">

                <h2>Entrada no Estoque</h2>
                {/* Data de Entrada */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Data de Entrada</label>

                    <Field
                      name="dataEntrada"
                      type="date"
                    />
                    <ErrorMessage
                      name="dataEntrada"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* RESPOSÁVEL */}
                  <div className="form-group">
                    <label>Responsável</label>

                    <Field
                      name="responsavel"
                      type="text"
                    />
                    <ErrorMessage
                      name="responsavel"
                      component="span"
                      className="error-message"
                    />
                  </div>
                  {/* Fornecedor */}
                  <div className="form-group">
                    <label>Fornecedor</label>

                    <Field
                      name="fornecedor"
                      type="text"/>
                    <ErrorMessage
                      name="fornecedor"
                      component="span"
                      className="error-message"
                    />
                  </div>
                   {/* NOTA FISCAL */}
                  <div className="form-group">
                    <label>Nota Fiscal</label>

                    <Field
                      name="notaFiscal"
                      type="text"
                    />
                    <ErrorMessage
                      name="notaFiscal"
                      component="span"
                      className="error-message"
                    />
                  </div>
                   {/* VALOR UNITÁRIO */}
                  <div className="form-group">
                    <label>Valor Unitário</label>

                    <Field
                      name="valorUnitario"
                      type="number"
                    />
                    <ErrorMessage
                      name="valorUnitario"
                      component="span"
                      className="error-message"
                    />
                  </div>
                    {/* VALOR TOTAL */}
                  <div className="form-group">
                    <label>Valor Total</label>

                    <Field
                      name="valorTotal"
                      type="number"
                    />
                    <ErrorMessage
                      name="valorTotal"
                      component="span"
                      className="error-message"
                    />
                  </div>

                </div>
              </div>
             
              {/* ================================================================= */}

              {/*========================ARMAZENAMENTO============================= */}

              <div className="form-card">
                <h2>Armazenamento</h2>
                
                <div className="form-grid">
                 {/* TEMPERATURA */}
                  <div className="form-group">
                    <label>Temperatura Ideal</label>

                    <Field
                      name="temperatura"
                      type="text"
                    />
                  </div>
                  
                  {/* AMARZENAMENTO LOCAL */}
                  <div className="form-group">
                   
                    <label>
                      Local de Armazenamento
                    </label>
                    <Field
                      as="select"
                      name="localArmazenamento"
                    >
                      <option value="">
                        Não necessita de refrigeração
                      </option>

                      <option value="Geladeira 1">
                        Geladeira 1
                      </option>
                      <option value="Geladeira 2">
                        Geladeira 2
                      </option>

                      <option value="Freezer">
                        Freezer
                      </option>

                      <option value="Sala Veterinária">
                        Sala Veterinária
                      </option>
                    </Field>

                    <ErrorMessage
                      name="localArmazenamento"
                      component="span"
                      className="error-message"
                    />
                  </div>

                </div>

                <div className="checkbox-group">
                  <Field type="checkbox" name="refrigeracao" id="refrigeracao" />
                  <label htmlFor="refrigeracao">Necessita de refrigeração</label>
                </div>
              </div>

               {/* ================================================================= */}

              

              <div className="submit-area">

                <Button type="submit">
                  {
                    modoEdicao
                      ? "Salvar Alterações"
                      : "Cadastrar Vacina"
                  }
                </Button>

              </div>

            </Form>

          )}

        </Formik>

      </section>
    </Layout >
  );
}

export default function CadastroVacinaPage() {
  return (
    <Suspense fallback={<p>Carregando formulário...</p>}>
      <CadastroVacinaFormulario />
    </Suspense>
  );
}
