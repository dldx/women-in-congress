"""
Method for separating out speeches dataframe into more accessible formats.
We put all the numerical and MP data into an HDF5 table which allows us to query by row
and we put the speeches into a bcolz array which allows us to read directly from disk in an efficient manner
"""
import bcolz
import pandas as pd

# Load speeches
speeches = pd.read_hdf("raw_speeches.h5")

# separate data and speech text into different dataframes
speeches_ = speeches.drop("body", axis=1)
speeches = speeches[["body"]]

# Save data to hdf5
speeches_.to_hdf("speeches_metadata.h5", "metadata", mode="w", format="table")

# Save speeches to bcolz array
bcolz.carray(speeches["body"], rootdir="speeches.bcolz", chunklen=10000000, cparams=bcolz.cparams(cname="lz4hc"))
