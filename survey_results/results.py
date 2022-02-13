# Python program to read
# json file
  
  
import json
import matplotlib.pyplot as plt
import statistics 

# List of the audio files used for the listening survey
audioFiles = ["Real_Thunder.wav","Farnell.wav","Fineberg_Walters_Reiss.wav","FXive.wav","Saksela.wav"]

# Labels for each of these files as referred to in the graph of the results
labels = ["Recording", "Farnell", "Fineberg", "FXive", "Saksela"]

# Used for parsing the metadata questions
questionCategories = ["About you", "Surroundings"]

# Prepare data map
evalMap = {}
for sample in audioFiles:
    evalMap[sample]=[]

# Opening JSON file
f = open('data.json',)
  
# returns JSON object as 
# a dictionary
data = json.load(f)

# Find the ranking numerical part of the response
def isDigit(x):
    try:
        float(x)
        return True
    except ValueError:
        return False

# Extract numerical score from Rating & Comments section
def parseScore(rating):
    rating = rating.replace("-"," ")
    rating = rating.replace(":"," ")
    rating = rating.replace("/"," ")
    rating = rating.replace("..."," ")
    rating = rating.replace(". "," ")
    rating = rating.replace(", "," ")
    return [float(s) for s in rating.split() if isDigit(s)]


# Prepare data structs for holding metadata
demoMap={}
demos=["gender", "age", "hearing", "hardware", "room", "audio-prof"]
for demo in demos:
    demoMap[demo] = []

# Iterating through the json
# list
for i in data:
    print("response ", i["testId"]["$oid"])
    print("gender: ", i["items"][7]["questionControl"]["value"])
    print("hardware: ", i["items"][11]["questionControl"]["value"])
    if len(i["items"]) != 0 :
        items = i["items"]
        for j in items:
            if "example" in j:
                sound=""
                if len(j["example"]["medias"]) != 0:
                    sound = j["example"]["medias"][0]["filename"]
                    rating = j["example"]["fields"][1]["value"]
                    score=parseScore(rating)
                    evalMap[sound].append(score[0])
                    if "EVA" in sound:
                        print(sound+ " " + rating)
            if "title" in j and j["title"] in questionCategories:
                if j["questionControl"]["question"] == "What is your gender?":
                    demoMap["gender"].append(j["questionControl"]["value"])
                if j["questionControl"]["question"] == "What kind of listening environment are you in right now?":
                    demoMap["room"].append(j["questionControl"]["value"])
                if j["questionControl"]["question"] == "How old are you?":
                    demoMap["age"].append(int(j["questionControl"]["value"]))
                if j["questionControl"]["question"] == "How would you describe your hearing?":
                    demoMap["hearing"].append(j["questionControl"]["value"])
                if j["questionControl"]["question"] == "How would you describe your knowledge of audio quality?":
                    demoMap["audio-prof"].append(j["questionControl"]["value"])
                if j["questionControl"]["question"] == "What are you using to listen to these audio clips?":
                    demoMap["hardware"].append(j["questionControl"]["value"])

# Extract information regarding gender
f=0
m=0
o=0
for g in demoMap["gender"]:
    if g[0].upper() =="F" or g[0].upper() =="W":
        f+=1
    elif g[0].upper()=="M":
        m+=1
    else:
        o+=1
        print(g)
print(f," womyn* took the survey and ", m, " men* and ", o, " other.")


# Determine the median age
med_age=statistics.median(demoMap["age"])
print(demoMap["age"])
print("median age: \n", med_age)

# Extract data about hearing ability
hearingMap={}
hearingOpts=["I have normal hearing",
            "I suspect I have a hearing deficiency in one or both ears",
            "I have a diagnosed hearing impediment"]
for opt in hearingOpts:
    hearingMap[opt]=0
for hear in demoMap["hearing"]:
    hearingMap[hear]+=1
print(hearingMap)

# Extract data about surrounding environment
roomMap={}
roomOpts=["Quiet room",
            "Busy or noisy room",
            "Public space"]
for opt in roomOpts:
    roomMap[opt]=0
for room in demoMap["room"]:
    roomMap[room]+=1
print(roomMap)

# Extract data about hardware used to participate
hardwareMap={}
hardwareOpts=["Studio headphones (e.g. Audio Technica or Beyerdynamic)",
            "My computer speakers",
            "Consumer headphones (e.g. Bose or Apple)",
            "External speaker setup",
            "Phone speakers"]
for opt in hardwareOpts:
    hardwareMap[opt]=0
for hardware in demoMap["hardware"]:
    hardwareMap[hardware]+=1
print(hardwareMap)

# Extract data about level of audio-professionalism
audioMap={}
audioOpts=["I am a professional working in the area of audio.",
            "I am an audio enthusiast but I don't work in the area.",
            "I don't normally pay special attention to audio quality."]
for opt in audioOpts:
    audioMap[opt]=0
for audio in demoMap["audio-prof"]:
    audioMap[audio]+=1

print(audioMap)

# Print averages of each ranking
for idx in range(len(audioFiles)):
    scores = evalMap[audioFiles[idx]]
    sum = 0
    for score in scores:
        sum+=score
    printf(labels[idx]+" avg: %.2f", sum/len(scores))

# Plot the data
conf_intervals=[(None,None), (None,None), (None,None), (None,None), (None,None)]
plt.box
box_plot_data=[evalMap[audioFiles[0]], evalMap[audioFiles[1]],evalMap[audioFiles[2]],evalMap[audioFiles[3]],evalMap[audioFiles[4]]]
plt.boxplot(box_plot_data, notch=True, bootstrap=10000, whis=(60, 95), vert=1, patch_artist=True, labels=labels)
plt.title('')
plt.ylabel('Realness Score')
plt.xlabel('Method')
plt.show(block=True)

# Closing file
f.close()
