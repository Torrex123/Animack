import os
import sqlite3
import json

class Database:

    def checkRegisters(self):

        def createDB():
            # Creating the database
            conn = sqlite3.connect('src/data/myList.db')

            # cursor for executing sql commands
            cursor = conn.cursor()

            # create the anime table
            cursor.execute("""CREATE TABLE ANIME (
                                row text,
                                id integer,
                                name text,
                                status text,
                                progress text,
                                episodes text,
                                release_date text,
                                score text,
                                cover_image text
                            )""")

            # create the manga table
            cursor.execute("""CREATE TABLE MANGA (
                                row text,
                                id integer,
                                name text,
                                status text,
                                progress text,
                                episodes text,
                                release_date text,
                                score text,
                                cover_image text
                                )""")

            # close database connection
            conn.close()

        # checks if the database exist
        check_file_existence = os.path.exists("src/data/myList.db")

        if (check_file_existence == False):
            # create a database
            createDB()

    def addRow(self, object):

        # Look for the corresponding table
        table = object.type

        #connect to the database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # building the row
        instruction = f"INSERT INTO {table} VALUES('0', {object.aniList_ID}, '{object.title}', '{object.status}','{object.progress}'," \
                      f"'{object.episodes}', '{object.start_date}', '{object.score}', '{object.coverimage}')"

        # execute the instructions
        cursor.execute(instruction)

        # save changes
        conn.commit()

        # close database connection
        conn.close()

    def checkContents(self, type, target_id):

        # connects to the database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"SELECT * FROM {type} WHERE id={target_id}"

        # execute the instructions
        cursor.execute(instruction)

        # collecting the data
        datos = cursor.fetchall()

        # save changes
        conn.commit()

        # close database connection
        conn.close()

        # if the search throws an empty list, means that the content is not in the database
        if (len(datos)):
            return True
        else:
            return False

    def remove_row(self, target_id, type):

        # connects to the database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"DELETE FROM {type} WHERE id = {target_id}"

        # execute the instructions
        cursor.execute(instruction)

        # save changes
        conn.commit()

        # close database connection
        conn.close()

    def countRows(self, type):

        # connect to the database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"SELECT COUNT(*) FROM {type}"

        cursor.execute(instruction)

        # collecting the data
        data = cursor.fetchall()

        data = data[0][0]

        # save changes
        conn.commit()

        # close database connection
        conn.close()

        return data

    def updateRowScore(self, type, score, target_id):

        # connects to tge database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"UPDATE {type} SET score = {score} WHERE id = {target_id}"

        #execute instruction
        cursor.execute(instruction)

        # save changes
        conn.commit()

        # close database connection
        conn.close()

    def updateRowProgress(self, type, progress, target_id ):

        # connects to tge database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"UPDATE {type} SET progress = {progress} WHERE id = {target_id} "

        #execute instruction
        cursor.execute(instruction)

        # save changes
        conn.commit()

        # close database connection
        conn.close()

    def updateRowStatus(self, type, status, target_id):

        # connects to tge database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"UPDATE {type} SET status= '{status}' WHERE id = {target_id} "

        # execute instruction
        cursor.execute(instruction)

        # save changes
        conn.commit()

        # close database connection
        conn.close()

    def updateAllRowsIndexes(self, type):

        # connects to tge database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        #getting all the ids
        data = cursor.execute(f'SELECT * From {type}').fetchall()

        #make a list
        idList = []

        #append ids in list
        for i in range(len(data)):
            idList.append(data[i][1])

        #uptade row numbers
        for i in range(len(data)):

            #execute instruction
            cursor.execute(f'UPDATE {type} SET row ={i+1} WHERE id = {idList[i]}')

        # save changes
        conn.commit()

        # close database connection
        conn.close()

    def getRows(self, type, index):

        # connects to tge database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # getting all the ids
        data = cursor.execute(f'SELECT * From {type} WHERE row = {index}').fetchall()

        # save changes
        conn.commit()

        # close database connection
        conn.close()

        #create a dictionary
        Dictionary = {"id":data[0][1], "title":data[0][2], "status":data[0][3], "progress":data[0][4],
                      "episodes": data[0][5], "releasedate":data[0][6], "score":data[0][7], "coverimage":data[0][8]}

        # convert dictionary to json
        json_string = json.dumps(Dictionary)

        return json_string

    def getRandomRow(self, type):

        # connects to the database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"SELECT * FROM {type} ORDER BY RANDOM () LIMIT 1"

        # execute the instructions
        data = cursor.execute(instruction).fetchall()

        # save changes
        conn.commit()

        # close database connection
        conn.close()

        return data

    def getRowEpisodes(self, type, id):

        # connects to the database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"SELECT * FROM {type} WHERE id = {id}"

        # execute the instructions
        data = cursor.execute(instruction).fetchall()[0][5]

        # save changes
        conn.commit()

        # close database connection
        conn.close()

        return data

    def getRowProgress(self, type, id):

        # connects to the database
        conn = sqlite3.connect('src/data/myList.db')

        # cursor for executing sql commands
        cursor = conn.cursor()

        # instruction
        instruction = f"SELECT * FROM {type} WHERE id = {id}"

        # execute the instructions
        data = cursor.execute(instruction).fetchall()[0][4]

        # save changes
        conn.commit()

        # close database connection
        conn.close()

        return data
