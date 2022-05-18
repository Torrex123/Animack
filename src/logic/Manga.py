class Manga:

    #constructor
    def __init__(self, title, type, id, status, progress, episodes, start_date, coverimage, score):
        self.title = title
        self.aniList_ID = id
        self.type = type
        self.status = status
        self.start_date = start_date
        self.progress = progress
        self.episodes = episodes
        self.coverimage = coverimage
        self.score = score