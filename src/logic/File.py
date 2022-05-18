import shutil
import os

class File():

    def saveDatabaseCopy(self, destination_route, file_name):

        #copy the database to an specific path
        shutil.copy('src/data/myList.db', destination_route)

        old_name = fr'{destination_route}/myList.db'

        new_name = fr'{destination_route}/{file_name}'

        os.rename(old_name, new_name)

    def deleteAllData(self, check_existence):

        if(check_existence):

            #delete the database
            os.remove('src/data/myList.db')

            return 'All the info has been successfully deleted!'

        else:

            return 'No info to delete!'

    def overwriteDatabase(self, route, check_file_existence):

        #change the name of the imported file
        def changeName():

            #get all the file names contained in the 'data' folder
            name = os.listdir('src/data')

            #get the name of the database file contained in data folder
            if name[0] == 'preferences.cfg':

                name = name[1]

            else:

                name = name[0]

            #get the user data folder absolute path
            path = os.path.abspath('src/data/')
            
            #get the original imported file name
            old_name = fr'{path}/{name}'

            #change original file name to 'myList.db'
            new_name = fr'{path}/myList.db'

            #rename the file
            os.rename(old_name, new_name)

        #get the absolute path of the database folder
        my_destination = os.path.abspath('src/data/')

        #copy a selected file to the app folder
        shutil.copy(route, my_destination)

        #if exists, delete the current database
        if(check_file_existence):
    
            os.remove("src/data/myList.db")

        changeName()

    def defaultPreference(self):

        check_file_existence = os.path.exists("src/data/preferences.cfg")

        if (check_file_existence == False):
            #save user preferences
            with open('src/data/preferences.cfg', "w") as pref:
                pref.write('adult')

            pref.close()

    def preferences(self, preference):

        #save user preferences
        with open('src/data/preferences.cfg', "w") as pref:
            pref.write(preference)

        pref.close()

    def getPreference(self):

        #get the user preference
        with open('src/data/preferences.cfg', "rt") as pref:
            string = pref.read()

        pref.close()

        return string

    def checkDatabaseExistence(self):

        #check if the file exists

        return os.path.exists("src/data/myList.db")