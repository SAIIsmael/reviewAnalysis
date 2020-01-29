
# Commandes utiles

## GIT

### Comment faire un commit :

    $ git add file1.cpp file2.h # ajoute les fichiers au prochain commit
    $ git status # pour vérifier la liste des fichiers ajoutés
    $ git commit # affiche l'éditeur de texte pour saisir le message du commit
    $ git push # pousse sur le serveur le commit

### Pour modifier le dernier commit (déjà push) :

    $ git add file3.cpp # ajoute le fichier
    $ git status # pour vérifier la liste des fichiers ajoutés
    $ git commit --amend # ajoute les modifications au dernier commit + affiche l'éditeur avec l'ancien message.
    $ git push --force # pousse sur le serveur le commit (et le force)

### Pour mettre à jour sa branche après une MR acceptée :

    $ git checkout master
    $ git pull
    $ git checkout <VOTREBRANCHE>
    $ git rebase master


