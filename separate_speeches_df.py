"""
Method for separating out speeches dataframe into more accessible formats.
We put all the numerical and MP data into an HDF5 table which allows us to query by row
and we put the speeches into a bcolz array which allows us to read directly from disk in an efficient manner
"""
import bcolz
import pandas as pd

# Load speeches
speeches = pd.read_hdf("/media/Stuff/processed_speeches_new.h5", "speeches_0")\
    .append([pd.read_hdf("/media/Stuff/processed_speeches_new.h5", "speeches_1")], ignore_index=True)

# Convert column types
speeches["date"] = pd.to_datetime(speeches["date"])
speeches["mp_id"] = pd.to_numeric(speeches["mp_id"]).astype("category")
speeches["section_id"] = speeches["section_id"].astype(str)
speeches["mp_name"] = speeches["mp_name"].astype(str)
speeches["debate_title"] = speeches["debate_title"].astype(str).astype("category")
speeches["n_words"] = speeches["n_words"].astype("float32")

speeches[list(range(100))] = speeches[list(range(100))].apply(lambda x: x.astype("float32"))

# separate data and speech text into different dataframes
speeches_ = speeches.drop("body", axis=1)
speeches = speeches[["body"]]

# Save data to hdf5
speeches_.to_hdf("speeches.h5", "speeches", mode="w", format="table")

# Save speeches to bcolz array
bcolz.carray(speeches["body"], rootdir="/media/Stuff/speeches.bcolz", chunklen=10000000, cparams=bcolz.cparams(cname="lz4hc"))
