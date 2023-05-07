# kmeans-impl
Este projeto foi criado para um Trabalho Prático da disciplina de Modelagem e Avaliação de Desempenho do curso de Engenharia de Computação.
Há duas implementações diferentes do algoritmo KMeans. Uma implementação padrão, onde os clusters iniciais são selecionados aleatoriamente, e uma implementação similar ao KMeans++, onde os clusters iniciais são selecionados a partir de uma distribuição probabilística onde clusters mais distantes uns dos outros serão selecionados mais frequentemente.

# Requisitos
- NodeJS v17.1.0
- Gerenciador de pacotes pnpm

# Instalação
Executar o comando

        pnpm install

# Opções
Para executar uma implementação específica, basta executar:

        pnpm run naive

Que executará o algoritmo padrão, ou
        
        pnpm run heuristic

Que executará o algoritmo com heurística.

Ambos comandos aceitam um argumento que define o valor de k utilizado, por exemplo:

        pnpm run heuristic 5

Que executará o algoritmo com heurística com k = 5

Ao final da execução é aberto o navegador com uma página da web exibindo o resultado da clusterização.

O comando

        pnpm run benchmark
    
Executará ambos os algoritmos sequencialmente, com valores de k de 2 a 10, com 100 iterações cada,
sendo um processo que levará alguns minutos dependendo do computador utilizado,
exibindo ao final uma tabela com os dados médios das execuções, e abrindo uma página web com as clusterizações geradas de cada valor de k.


O comando

        pnpm run filter

Apenas utiliza o arquivo `municipios.json` para gerar um segundo arquivo chamado `municipiosmg.json`, contendo apenas os municípios de Minas Gerais.
