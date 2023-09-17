# Sapporoulette

Un jeu Ouestampes(tm)

## Installation

```
yarn install
```

## Lancement

Il faut un fichier `creds.json` contenant la clé API et une propriété `sheet` qui contient l'ID du sheet google contenant les questions

Demander sur le Discord asso pour le fichier par exemple.

Puis :

```
yarn start
```

## Construire un binaire Windows

```
yarn dist
```

Les binaires sont dans le dossier `packages`.

## Développeurs

Pensez à faire un

```
husky install
```

Pour installer les hooks git afin que prettier fasse son office à chaque commit.
